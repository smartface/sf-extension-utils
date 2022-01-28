import Hardware from "@smartface/native/device/hardware";
import System from "@smartface/native/device/system";
import Data from "@smartface/native/global/data";
import AlertView from "@smartface/native/ui/alertview";

enum DataVariables {
  BIOMETRIC_ENABLED = "UTIL_BIOMETRIC_ENABLED",
  BIOMETRIC_ACTIVATION_ASKED = "UTIL_BIOMETRIC_ACTIVATION_ASKED",
}

const faceIDNotWorkingDevices = ["huawei"];

type PromptUsage = {
  title: string;
  message: string;
  positiveActionText: string;
  negativeActionText: string;
};

type Validate =
  | {
      promptUsage: true;
      checkPromptAsked?: boolean;
      title: string;
      message: string;
      cancelButtonText: string;
      promptOpts: PromptUsage;
    }
  | {
      promptUsage: false;
      checkPromptAsked?: boolean;
      title: string;
      message: string;
      cancelButtonText: string;
    };

class Biometrics {
  private __biometricEnabled: boolean;
  private __biometricPromptAsked: boolean;
  private __isBiometricValidationActive = false;
  constructor() {
    this.__biometricEnabled = !!Data.getBooleanVariable(
      DataVariables.BIOMETRIC_ENABLED
    );

    this.__biometricPromptAsked = !!Data.getBooleanVariable(
      DataVariables.BIOMETRIC_ACTIVATION_ASKED
    );
  }

  get hasSupport(): boolean {
    return System.biometricsAvailable;
  }

  get enabled(): boolean {
    return this.__biometricEnabled;
  }

  set enabled(value: boolean) {
    this.__biometricEnabled = value;
    Data.setBooleanVariable(DataVariables.BIOMETRIC_ENABLED, value);
  }

  get promptAsked(): boolean {
    return this.__biometricPromptAsked;
  }

  set promptAsked(value: boolean) {
    this.__biometricPromptAsked = value;
    Data.setBooleanVariable(DataVariables.BIOMETRIC_ACTIVATION_ASKED, value);
  }

  private promptUsage(opts: PromptUsage) {
    const { title, message, negativeActionText, positiveActionText } = opts;
    return new Promise<void>((resolve, reject) => {
      global.alert({
        title,
        message,
        buttons: [
          {
            text: positiveActionText,
            type: AlertView.Android.ButtonType.POSITIVE,
            onClick: async () => {
              try {
                this.enabled = true;
                resolve();
              } catch (err) {
                this.enabled = false;
                resolve();
              } finally {
                this.promptAsked = true;
              }
            },
          },
          {
            text: negativeActionText,
            type: AlertView.Android.ButtonType.NEGATIVE,
            onClick: () => {
              this.enabled = false;
              this.promptAsked = true;
              reject();
            },
          },
        ],
      });
    });
  }

  validate(opts: Validate, showAlert = true) {
    const { title, message, checkPromptAsked, cancelButtonText } = opts;
    return new Promise<void>(async (resolve, reject) => {
      if (this.__isBiometricValidationActive) {
        return reject({
          ...Error("Biometic prompt is already active"),
          deactivatePrompt: true,
        });
      }

      if (checkPromptAsked) {
        if (!this.__biometricPromptAsked && opts.promptUsage) {
          try {
            await this.promptUsage(opts.promptOpts);
          } catch (err) {
            reject(Error("Biometric is disabled"));
          }
        }
      } else {
        if (opts.promptUsage) {
          try {
            await this.promptUsage(opts.promptOpts);
          } catch (err) {
            reject(Error("Biometric is disabled"));
          }
        }
      }

      this.__isBiometricValidationActive = true;
      if (!this.__biometricEnabled) {
        return reject(Error("Biometric is disabled"));
      }
      if (!this.hasSupport) {
        if (!showAlert) {
          return reject(Error("Won't show use fingerprint alert"));
        }
        if (
          faceIDNotWorkingDevices.some((device) =>
            Hardware.brandName.toLowerCase().includes(device.toLowerCase())
          )
        ) {
          return reject(`${Hardware.brandName} alert redirection is disabled`);
        }
        return reject();
      } else {
        System.validateBiometric({
          android: {
            title,
            cancelButtonText,
          },
          message,
          onSuccess: () => resolve(),
          onError: (e, err) => reject(Error("Unable to scan")),
        });
      }
    })
      .then(() => (this.__isBiometricValidationActive = false))
      .catch((err = Error()) => {
        this.__isBiometricValidationActive = !!err.deactivatePrompt;
        throw err.message;
      });
  }
}

export default Biometrics;
