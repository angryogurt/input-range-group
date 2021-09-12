export class InputRangeGroup {

	defaultConfig = {
		selector: null,
		data: null,
		available: 0,
		sum: {
			max: null,
			min: 0,
		},
		value: {
			min: 0,
			max: null,
			step: 1,
			default: 0
		}
	}
	
	constructor(config) {

		let inputGroupTemplateSelector = $('#input-group-template');
		this.inputGroupTemplate = Handlebars.compile(inputGroupTemplateSelector.html());

		let inputRangeTemplateSelector = $('#input-range-template');
		this.inputRangeTemplate = Handlebars.compile(inputRangeTemplateSelector.html());

		this.inputConfig = config;

		this.elementsData = config.data;

		this.initElements();

		this.processSumConfig();

		this.render();
	}

	initElements() {

		this.setElementsInitValue();

    	this.processInputConfig();

		this.setElementsRangeAndStep();

	}

	setElementsInitValue() {
		let configInputValue = this.inputConfig.value.default;
		let defaultInputValue = this.defaultConfig.value.default;
		this.elementsData.forEach(function (element) {
			element['value'] = element['value'] ?? (configInputValue ?? defaultInputValue);
		});
	}

	processInputConfig() {
		this.inputConfig.available = this.inputConfig.available ?? this.defaultConfig.available;
		this.inputConfig.value = {
			min: this.calcMinValue(),
			max: this.calcMaxValue(),
			step: this.inputConfig.value.step ?? this.defaultConfig.value.step
		};	
	}

	setElementsRangeAndStep() {
		let inputConfigValue = this.inputConfig.value;
		this.elementsData.forEach(function (element) {
			element['step'] = element['step'] ?? inputConfigValue.step
			element['min'] = element['min'] ?? inputConfigValue.min;
			element['max'] = element['max'] ?? inputConfigValue.max;
		});
	}

	calcMinValue() {
		return this.inputConfig.value.min ?? this.defaultConfig.value.min
	}

	calcMaxValue() {
		return this.inputConfig.value.max ?? this.calcElementsValueSum() + this.inputConfig.available;
	}

	calcElementsValueSum() {
		return this.elementsData.reduce(function (sum, current) {
			return sum + current.value;
		}, 0);
	}

	processSumConfig() {
		this.inputConfig.sum = {
			min: this.calcMinSum(),
			max: this.calcMaxSum()
		}
	}

	calcMinSum() {
		return this.inputConfig.sum.min ?? this.calcMinInputsValueSum();
	}

	calcMaxSum() {
		return this.inputConfig.sum.max ?? this.calcMaxInputsValueSum();
	}

	calcMinInputsValueSum() {
		return this.elementsData.reduce(function (sum, current) {
        	return sum + current.min;
        }, 0);
	}

	calcMaxInputsValueSum() {
		return this.elementsData.reduce(function (sum, current) {
        	return sum + current.max;
        }, 0);
	}

	render() {

		let template = this.inputRangeTemplate;

        let html = "";

        this.elementsData.forEach(function (element) {
			html += template(element);
    	});

    	this.inputConfig.selector.html(html);
	}

	check(input) {
		let elementId = $(input).data('element-id');
		let inputVal = Number($(input).val());
		let currentSum = this.calcCurrentElementSum(elementId, inputVal);

		if (this.checkMinSum(currentSum) && this.checkMaxSum(currentSum)) {
			this.updateElementValue(elementId, inputVal);
			this.updateAvailable();
		}
		else {
			this.resetElementValue(elementId, input);
		}
	}

	calcCurrentElementSum(changedElementId, currentValue) {
		let savedValue = this.elementsData.find(item => item.id == changedElementId).value;
		return this.calcElementsValueSum() + currentValue - savedValue;
	}

	checkMinSum(value) {
		return value >= this.inputConfig.sum.min;
	}

	checkMaxSum(value) {
		return value <= this.inputConfig.sum.max;
	}

	updateElementValue(id, value) {
		let element = this.elementsData.find(item => item.id == id);
		element.value = value;		
		$('.group-number-input[data-element-id="' + id + '"]').val(value);
	}

	updateAvailable() {
		this.inputConfig.available = this.calcAvailable();
		$('#available_arm_num').val(this.inputConfig.available);
	}

	calcAvailable() {
		return 0;
	}

	resetElementValue(id, input) {
		$(input).val(this.elementsData.find(item => item.id == id).value);
	}

	getData() {

	}

}