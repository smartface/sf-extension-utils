import System from 'sf-core/device/system';
import Picker from 'sf-core/ui/picker';
import KeyboardLayout from 'keyboardlayout';
import FlexLayout from 'sf-core/ui/flexlayout';
import moment from 'moment';
import Dialog from 'sf-core/ui/dialog';
import Screen from 'sf-core/device/screen';
import Color from 'sf-core/ui/color';
import Label from 'sf-core/ui/label';
import Button from 'sf-core/ui/button';
import View from 'sf-core/ui/view';
import Font from 'sf-core/ui/font';
import TextAlignment from 'sf-core/ui/textalignment';
import { IDateHourPicker, IDatePicker, IHourPicker } from './types';

export class DateHourPicker {
    options: IDateHourPicker;
    constructor(options?: IDateHourPicker) {
        this.options = {};
        this.options.yearRange = options.yearRange || 40;
        this.options.dateFormat = options.dateFormat || 'DD.MM.YYYY';
        this.options.hourFormat = options.hourFormat || 'HH:mm';
        this.options.dayWithNameFormat = options.dayWithNameFormat || 'D ddd';
        this.options.momentStartYear = options.momentStartYear || 1900;

        if (!options.texts) options.texts = {};
        this.options.texts.day = options.texts.day || 'Day';
        this.options.texts.month = options.texts.month || 'Month';
        this.options.texts.year = options.texts.year || 'Year';
        this.options.texts.hour = options.texts.hour || 'Hour';
        this.options.texts.minute = options.texts.minute || 'Minute';
        this.options.texts.ok = options.texts.ok || 'OK';
        this.options.texts.done = options.texts.done || 'Done';
        this.options.texts.cancel = options.texts.cancel || 'Cancel';

        if (!options.layoutStyle) options.layoutStyle = {};

        this.options.layoutStyle = {};
        this.options.layoutStyle.backgroundColor = options.layoutStyle.backgroundColor || Color.create(70, 0, 0, 0);
        this.options.layoutStyle.justifyContent = options.layoutStyle.justifyContent || FlexLayout.JustifyContent.CENTER;
        this.options.layoutStyle.alignItems = options.layoutStyle.alignItems || FlexLayout.AlignItems.CENTER;
    }

    /**
     * Creates a date picker as a `FlexLayout` or `Dialog`
     * @public
     * @method
     * @augments IDatePicker
     * @example
     * 
     * const dateHourPicker = new DateHourPicker({ layoutStyle: backgroundColor: Color.RED, texts: { cancel: 'Stornieren' } });
     * const datePickerDialog = dateHourPicker.createDatePicker({
     *   onPickerDone: date => {
     *      this.lblDateValue.text = date.toDateString();
     *   }
     * }) as Dialog;
     * datePickerDialog.show();
     */
    createDatePicker(options: IDatePicker): FlexLayout | Dialog {
        const momentObject = moment();
        let currentMoment = moment();
        const processResult = () => {
            const dateFormat = this.getDateString({
                day: daysInNumber[dayPicker.currentIndex],
                month: monthPicker.currentIndex,
                year: Number(yearPicker.items[yearPicker.currentIndex])
            });
            currentMoment = moment(dateFormat, this.options.dateFormat);
            if (options.textBox) {
                options.textBox.text = dateFormat;
            }
        };
        const startDay = options.startDay || momentObject.date();
        const startMonth = options.startMonth || momentObject.month();
        const startYear = options.startYear || this.options.yearRange;
        const endYear = options.endYear || momentObject.year();

        const currentDay = options.currentDay || startDay;
        const currentMonth = moment().month(options.currentMonth || startMonth);
        const currentMonthIndex = currentMonth.month();
        const currentYear = options.currentYear || endYear;

        const days = this.getDays({ month: currentMonthIndex, year: currentYear });
        const daysInNumber = this.getDays({ month: currentMonthIndex, year: currentYear, format: "D" }).map((day) => Number(day));
        const months = moment.monthsShort(); //TODO: List months through current month from end of the years
        const years = this.getYears({ startYear, endYear });
        const dayPicker = this.createPicker(days);
        const monthPicker = this.createPicker(months);
        const yearPicker = this.createPicker(years);

        dayPicker.currentIndex = Math.max(daysInNumber.indexOf(currentDay), 0);
        monthPicker.currentIndex = Math.max(currentMonthIndex, 0);
        yearPicker.currentIndex = Math.max(years.indexOf(String(currentYear)), 0);

        monthPicker.onSelected = (index: number) => {
            const selectedMonth = months[index];
            const newDays = this.getDays({ month: moment().month(selectedMonth).month(), year: Number(yearPicker.items[yearPicker.currentIndex]) }) as [];
            dayPicker.items = newDays;
            if (dayPicker.currentIndex + 1 > newDays.length) {
                dayPicker.currentIndex = newDays.length - 1;
            }
            processResult();
        };

        yearPicker.onSelected = (index: number) => {
            monthPicker.onSelected(monthPicker.currentIndex); // To update days in case of leap year
            //TODO: Implement removing past months
            processResult();
        };

        dayPicker.onSelected = (index: number) => processResult();

        const pickerDone = () => {
            processResult();
            options.onPickerDone && options.onPickerDone(currentMoment.toDate());
        };

        const flDayPicker = this.createPickerLayout({ picker: dayPicker, label: this.options.texts.day });
        const flMonthPicker = this.createPickerLayout({ picker: monthPicker, label: this.options.texts.month });
        const flYearPicker = this.createPickerLayout({ picker: yearPicker, label: this.options.texts.year });
        const rootLayout = this.createPickerRootLayout([flDayPicker, flMonthPicker, flYearPicker], { onPickerDone: pickerDone, skipInputView: !options.textBox });
        if (System.OS === System.OSType.IOS) {
            if (options.textBox) {
                options.textBox.ios.inputView = { view: rootLayout as FlexLayout, height: 220 };
                const keyboardLayout = KeyboardLayout.init([options.textBox]);
                keyboardLayout[0].onDoneButtonClick = pickerDone;
            }
        }
        return rootLayout;
    }

    /**
     * Creates an hour picker as a `FlexLayout` or `Dialog`
     * @public
     * @method
     * @augments IHourPicker
     * @example
     * 
     * const dateHourPicker = new DateHourPicker({ layoutStyle: backgroundColor: Color.RED, texts: { done: 'Hecho' } });
     * const hourPickerDialog = dateHourPicker.createHourPicker({
     *   onPickerDone: date => {
     *      this.lblDateValue.text = date.toDateString();
     *   }
     * }) as Dialog;
     * hourPickerDialog.show();
     */
    createHourPicker(options: IHourPicker): FlexLayout | Dialog {
        let currentMoment = moment();
        const processResult = () => {
            const hourFormat = this.getHourString({
                hour: Number(hourPicker.items[hourPicker.currentIndex]),
                minute: Number(minutePicker.items[minutePicker.currentIndex])
            });
            currentMoment = moment(hourFormat, this.options.hourFormat);
            if (options.textBox) {
                options.textBox.text = currentMoment.format(this.options.hourFormat);
            }
        };
        const minutePeriod = options.minutePeriod || 1;
        const startMinute = options.startMinute || 0;
        const startHour = options.startHour || 0;

        const endMinute = options.endMinute || 60 - minutePeriod;
        const endHour = options.endHour || 23;

        const currentMinute = options.currentMinute || startMinute;
        const currentHour = options.currentHour || startHour;

        const hours = this.getRange(startHour, endHour, 1).map((hour) => this.getIntegerDoubleDigit(hour));
        const minutes = this.getRange(startMinute, endMinute, minutePeriod).map((minute) => this.getIntegerDoubleDigit(minute));
        const hourPicker = this.createPicker(hours);
        const minutePicker = this.createPicker(minutes);
        hourPicker.currentIndex = Math.max(hours.indexOf(this.getIntegerDoubleDigit(currentHour)), 0);
        minutePicker.currentIndex = Math.max(minutes.indexOf(this.getIntegerDoubleDigit(currentMinute)), 0);

        hourPicker.onSelected = () => processResult();
        minutePicker.onSelected = () => processResult();

        const pickerDone = () => {
            processResult();
            options.onPickerDone && options.onPickerDone(currentMoment.toDate());
        };

        const flHourPicker = this.createPickerLayout({ picker: hourPicker, label: this.options.texts.hour });
        const flMinutePicker = this.createPickerLayout({ picker: minutePicker, label: this.options.texts.minute });
        const rootLayout = this.createPickerRootLayout([flHourPicker, flMinutePicker], {
            onPickerDone: pickerDone,
            skipInputView: options.skipInputView
        });

        if (System.OS === System.OSType.IOS) {
            if (options.textBox) {
                options.textBox.ios.inputView = { view: rootLayout as FlexLayout, height: 220 };
                const keyboardLayout = KeyboardLayout.init([options.textBox]);
                keyboardLayout[0].onDoneButtonClick = pickerDone;
            }
        }
        return rootLayout;
    }

    /**
     * Returns Dialog for Android, FlexLayout for inputView
     */
    private createPickerRootLayout(pickerLayouts: FlexLayout[], options: {
        onPickerDone: (date?: Date) => any,
        onPickerCancel?: () => any,
        skipInputView?: boolean,
    }): FlexLayout | Dialog {
        const pickerDialog = new Dialog();
        const onPickerDone = () => {
            typeof options.onPickerDone === "function" && options.onPickerDone();
            pickerDialog.hide();
        };
        const onPickerCancel = () => {
            typeof options.onPickerCancel === "function" && options.onPickerCancel();
            pickerDialog.hide();
        };
        const { backgroundColor, alignItems, justifyContent } = this.options.layoutStyle;
        Object.assign(pickerDialog.layout, { backgroundColor, alignItems, justifyContent });
        const flPickerDialog = new FlexLayout({
            height: 250,
            width: System.OS === System.OSType.IOS ? 300 : Screen.width - 40,
            backgroundColor: Color.WHITE,
            borderRadius: System.OS === System.OSType.IOS ? 10 : 0,
            borderColor: Color.create("#c7c7c7"),
            borderWidth: System.OS === System.OSType.IOS ? 1 : 0
        });
        const flColumns = new FlexLayout({
            flexDirection: FlexLayout.FlexDirection.ROW,
            flexGrow: 1,
            marginBottom: 15
        });
        pickerLayouts.forEach((pickerLayout) => flColumns.addChild(pickerLayout));
        pickerDialog.layout.addChild(flPickerDialog);
        flPickerDialog.addChild(flColumns);
        const lineButtons = new View({
            height: 1,
            backgroundColor: Color.create("#c7c7c7")
        });
        System.OS === System.OSType.IOS && flPickerDialog.addChild(lineButtons);
        const flDialogButtons = this.createDialogButtons(onPickerDone, onPickerCancel);
        flPickerDialog.addChild(flDialogButtons);
        pickerDialog.layout.applyLayout();
        if (System.OS === System.OSType.IOS) {
            if (!!options.skipInputView) {
                return pickerDialog;
            }
            else {
                const flDialogs = new FlexLayout({ flexGrow: 1, flexDirection: FlexLayout.FlexDirection.ROW });
                pickerLayouts.forEach((pickerLayout) => flDialogs.addChild(pickerLayout));
                return flDialogs;
            }
        }
        else {
            return pickerDialog;
        }
    }

    private createDialogButtons(onDonePress: (...args: any[]) => void, onCancelPress: () => void): FlexLayout {
        const flDialogButtons = new FlexLayout({
            height: System.OS === System.OSType.IOS ? 50 : 40,
            flexDirection: FlexLayout.FlexDirection.ROW_REVERSE
        });
        const btnOK = new Button({
            text: System.OS === System.OSType.IOS ? this.options.texts.done : this.options.texts.ok,
            backgroundColor: Color.TRANSPARENT,
            font: Font.create("SFProText-Semibold", 13, Font.BOLD),
            textColor: System.OS === System.OSType.IOS ? Color.create("#007AFF") : Color.create("#00BFFF"),
            flexGrow: System.OS === System.OSType.IOS ? 1 : NaN,
            onPress: onDonePress
        });

        const btnCancel = new Button({
            text: this.options.texts.cancel,
            backgroundColor: Color.TRANSPARENT,
            textColor: System.OS === System.OSType.IOS ? Color.create("#007AFF") : Color.create("#00BFFF"),
            font: Font.create("SFProText-Semibold", 13, Font.BOLD),
            flexGrow: System.OS === System.OSType.IOS ? 1 : NaN,
            onPress: onCancelPress
        });
        flDialogButtons.addChild(btnOK);
        flDialogButtons.addChild(btnCancel);
        return flDialogButtons;
    }

    /**
     * Creates a relevant FlexLayout for given picker.
     * @param options 
     * @param {String} options.label - The label that is going to be put on top of picker on Android. This property is ignored on iOS.
     */
    private createPickerLayout(options: { picker: Picker, label: string }): FlexLayout {
        const flPicker = new FlexLayout({ flexGrow: 1 });
        if (System.OS === System.OSType.ANDROID) {
            const lblPicker = new Label({ text: options.label, height: 30, textAlignment: TextAlignment.MIDCENTER });
            flPicker.addChild(lblPicker);
        }
        flPicker.addChild(options.picker);
        return flPicker;
    }

    private createPicker(items: Array<string>): Picker {
        const picker = new Picker();
        picker.items = items;
        picker.flexGrow = 1;
        return picker;
    }

    private getRange(start: number, stop: number, step = 1): string[] {
        return Array.from({ length: (stop - start) / step + 1 }, (_, i) => String(start + (i * step)));
    }

    /**
     * Gets the day range of given month and year
     * @param {Number} [month = moment().month()] - Pass a month the way moment can understand. Defaults to current month.
     * @param {Number} [year = moment().year()] - Pass a year the way moment can understand. Defaults to current year.
     */
    getDays(options: { month?: number, year?: number, format?: string }): string[] {
        const monthToProcess = options.month || moment().month();
        const yearToProcess = options.year || moment().year();
        const formatToProcess = options.format || this.options.dayWithNameFormat;
        const date = moment({ month: monthToProcess, year: yearToProcess });
        return Array.from(Array(date.daysInMonth()).keys()).map((day) => {
            const currentDate = date.clone().add(day, "days");
            return currentDate.format(formatToProcess);
        });
    }

    /**
     * Passing 0 to any year parameter causes years to be default
     * @param {Object} options - Optional parameters to specify year range further
     * @param {Number} options.startYear - Defaults to PICKER_YEAR_RANGE at constans/index.ts
     * @param {Number} options.endYear - Defaults to current year of local device
     * @returns {Number[]} - An array of years
     */
    getYears(options?: { startYear?: number, endYear?: number }): string[] {
        const startYearRange = (options && options.startYear) ? options.startYear : this.options.momentStartYear;
        const endYearRange = (options && options.endYear) ? options.endYear : moment().year();

        return this.getRange(endYearRange, startYearRange, -1);
    }

    private getDateString({ year = 1970, month = 1, day = 1 }) {
        return moment({ year, month, day }).format(this.options.dateFormat);
    }

    private getHourString({ hour = 0, minute = 0 }) {
        return moment({ hour, minute }).format(this.options.hourFormat);
    }

    private getIntegerDoubleDigit(numberString) {
        //MINOR: Can be done with padStart
        if (Number(numberString) < 10) {
            return `0${numberString}`;
        }
        return numberString;
    }
}