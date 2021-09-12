import {InputRangeGroup} from "./InputRangeGroup.js";

const inputGroupWrapperSelector = $('#input-group-wrapper');

let elements = [
	{
		'id': 1,
		'title': "First element",
		'value': 1
	},
	{
		'id': 2,
		'title': "Second element",
		'value': 2
	},
	{
		'id': 3,
		'title': "Third element",
		'value': 3
	},
]

let inputGroup = new InputRangeGroup({
	selector: inputGroupWrapperSelector,
	data: elements,
	available: 0,
	sum: {
		min: 3
	},
	value: {
		min: 0,
		step: 1,
		default: 0
	}
});

$(document).on('input', '.group-range-input', function () {
	inputGroup.check(this);		 	                   
});