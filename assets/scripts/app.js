const addIngredientModal = document.querySelector('.add-ingredient-modal');
const editIngredientModal = document.querySelector('.edit-ingredient-modal');
const openAddIngredientModalBtn = document.querySelector(
	'.open__add-ingredient-modal__btn'
);
const totalsBtn = document.querySelector('header .totals-btn');
const backdrop = document.querySelector('.backdrop');
const startRenameRecipeBtn = document.querySelector(
	'.open__rename-recipe-modal__btn'
);
const startDeleteRecipeBtn = document.querySelector('.delete-recipe__btn');

const createRecipeModal = document.querySelector('.create-recipe-modal');
const openCreateRecipeModalBtn = document.querySelector(
	'.open__create-recipe-modal__btn'
);

const sidebarToggleBtn = document.querySelector('.side-bar--toggle-btn');
const sideBar = document.querySelector('.side-bar');
const sideBarPlaceholder = document.querySelector('.side-bar--placeholder');
const sideBarShadow = document.querySelector('.side-bar--shadow');


const portionTextInput = document.querySelector('.portion__text-input');
const calculateBtn = document.querySelector('.calculate-btn');
const equalRadioBtn = document.querySelector('#equal__radio-btn');
const weightRadioBtn = document.querySelector('#weight__radio-btn');
const radioItemWeight = document.querySelector('.radio-item-1');
const radioItemEqual = document.querySelector('.radio-item-2');

const entryTextSection = document.querySelector('.entry-text');

const contentContainer = document.querySelector('.content-container');



// const startCreateNewRecipeBtn = document.querySelector('.entry-text');

let ingrIndex = 0;
let activeIngredientID;
let activeModal = createRecipeModal;
let activeRecipe;
let stagedRecipe;
let activeIngredient;
let activeRecipeRenaming;
let activeCategory;

let sideBarOpen = false;
let contentWidth = contentContainer.offsetWidth;

const purchasedTotals = {
	price: 0,
	weight: 0,
};

const recipeTotals = {
	price: 0,
	weight: 0,
};

const portionTotals = {
	price: 0,
	weight: 0,
};

const recipes = [];

const populateApp = () => {
	ingredients.forEach((element) => {
		renderIngrElement(
			element.id,
			element.name,
			element.purchasedPrice,
			element.purchasedWeight,
			element.recipeWeight
		);
	});
};

// totals the cost and weight of all ingredients bought
const updatePurchasedTotals = () => {
	activeRecipe.purchasedTotals.price = 0;
	activeRecipe.purchasedTotals.weight = 0;

	activeRecipe.ingredients.forEach((ingr) => {
		activeRecipe.purchasedTotals.price += ingr.purchasedPrice;
		activeRecipe.purchasedTotals.weight += ingr.purchasedWeight;
	});
};

// totals up the cost and weight of what is actually used in a recipe
const updateRecipeTotals = () => {
	activeRecipe.recipeTotals.price = 0;
	activeRecipe.recipeTotals.weight = 0;

	activeRecipe.ingredients.forEach((ingr) => {
		activeRecipe.recipeTotals.price += ingr.recipePrice;
		activeRecipe.recipeTotals.weight += ingr.recipeWeight;
	});
};

// works out how much each ingredient costs for a RECIPE
const updateIngredientBaseCost = () => {
	activeRecipe.ingredients.forEach((ingr) => {
		let magicNumber = ingr.purchasedWeight / ingr.recipeWeight;
		magicNumber = magicNumber ? magicNumber : 0;
		ingr.recipePrice =
			ingr.purchasedPrice / magicNumber ? ingr.purchasedPrice / magicNumber : 0;
	});
};

// works out how much each ingredient costs for a given PORTION
const updateIngrportionFigures = (numberOfportions) => {
	ingredients.forEach((ingr) => {
		ingr.portionPrice = ingr.recipePrice / numberOfportions;
		ingr.portionWeight = ingr.recipeWeight / numberOfportions;
	});
};

const toggleBackdrop = () => {
	backdrop.classList.toggle('show');
};

const indexElementUsingID = (arr, ID) => {
	ingrIndex = 0;
	for (const i of arr) {
		if (i.id === ID) {
			break;
		}
		ingrIndex++;
	}
	return ingrIndex;
};

const clearIngredientInput = () => {
	const userInputs = activeModal.querySelectorAll('input');
	for (const input of userInputs) {
		input.value = '';
	}
};

const cancelModalHandler = () => {
	closeActiveModal();
	toggleBackdrop();
	clearIngredientInput();
};

const closeActiveModal = () => {
	activeModal.classList.remove('show');
};

const backdropClickHandler = () => {
	toggleBackdrop();
	closeActiveModal();
	clearIngredientInput();
};


const toggleSideBar = () => {
	const sidebarPlaceholder = sideBarPlaceholder;
	const menu = sideBar;
	const menuContainer = menu.children[0];
	const shadow = contentContainer;
	
	sidebarToggleBtn.classList.toggle('show');
	sidebarToggleBtn.children[0].classList.toggle('show')
	sidebarPlaceholder.classList.toggle('show');
	sideBarShadow.classList.toggle('show');
	menuContainer.classList.toggle('show');
	shadow.classList.toggle('show');
	menu.classList.toggle('show');

	// container.classList.toggle('show');
	// const content = contentContainer
	// const width = contentWidth;
	// let newWidth = width - 176;

	// if (sideBarOpen) {
	// 	// close side bar
	// 	content.style.transition = 'width .2s ease';
	// 	content.style.width = `${width}px`;

	// 	sideBarOpen = false
	// }else {
	// 	// open side bar
	// 	content.style.transition = 'width .2s ease';
	// 	content.style.width = `${newWidth}px`;
	// 	sideBarOpen = true;

	// }
};


const sidebarCategoryBtnHandler = () => {
	const sidebarContent = document.querySelector('.side-bar--content').children;

	for (const i of sidebarContent) {
		i.children[0].addEventListener('click', () => {
			i.children[1].classList.toggle('show');
			// if (activeCategory) {
				// activeCategory.classList.remove('active');
				// activeCategory.nextElementSibling.classList.remove('show')
			// }
			// activeCategory = i.children[0];
			// activeCategory.classList.add('active');
			
		});
		
	}
}
const pulseAnimation = (element) =>
	// We create a Promise and return it
	new Promise((resolve, reject) => {
		const node = element;
		node.classList.add('pulse');

		function handleAnimationEnd(event) {
			event.stopPropagation();
			node.classList.remove('pulse');
			resolve('Animation ended');
		}

		node.addEventListener('animationend', handleAnimationEnd, { once: true });
	});

const checkElementExists = (element) => {
	const node = document.querySelector(element);
	return document.body.contains(node) ? true : false;
};

const checkactiveVsStagedRecipe = () => {
	const elementExists = checkElementExists('.input-error');

	if (
		JSON.stringify(activeRecipe) !== JSON.stringify(stagedRecipe) &&
		activeRecipe.hasCalculated &&
		!elementExists
	) {
		const btn = document.querySelector('.calculate-btn');

		const newInputError = document.createElement('div');

		newInputError.className = 'input-error';
		newInputError.innerHTML = `
		<div>
			<p>Recipe has changed, please recalculate</p>
		</div>
		`;
		btn.after(newInputError);
		btn.textContent = 'Recalculate';
	}
};

// ======================= Calculator ==============================

const calculateBtnHandler = () => {
	const input = portionTextInput.value;

	if (checkElementExists('.input-error')) {
		document.querySelector('.input-error').remove();
		const btn = document.querySelector('.calculate-btn');
		btn.textContent = 'Calculate';
	}

	activeRecipe.hasCalculated = true;
	stagedRecipe = JSON.parse(JSON.stringify(activeRecipe));

	let answer;
	const recipePrice = stagedRecipe.recipeTotals.price;
	const recipeWeight = stagedRecipe.recipeTotals.weight;

	const element = document.querySelector('.answer-element');

	// element.innerHTML = `<h3>1 portion = £${answer}</h3>`
	// placeholder.replaceWith(element);

	if (equalRadioBtn.checked) {
		answer = recipePrice / input;
		answer = answer.toFixed(2);
		console.log(answer);
		element.textContent = (answer < 1.0) ? `1 portion = ${answer}p` : `1 portion = £${answer}`;
		
		
	}
	
	if (weightRadioBtn.checked) {
		answer = recipePrice * (input / recipeWeight).toFixed(2);
		// answer = answer.toFixed(2);
		console.log(answer);
		element.textContent = (answer < 1.0) ? `1 portion = ${answer}p` : `1 portion = £${answer}`;
	}
};

const test = () => {
	// stagedRecipe = Object.assign({}, activeRecipe);
	// stagedRecipe.name = 'poo'

	// console.log(JSON.stringify(activeRecipe));
	console.log(JSON.stringify(activeRecipe) === JSON.stringify(stagedRecipe));

	// if (JSON.stringify(activeRecipe) === JSON.stringify(stagedRecipe)) {
	// 	console.log('same');
	// } else {
	// 	console.log('different');

	// }
};

// ======================= Add ingredients ==============================
const renderIngrElement = (
	id,
	name,
	price,
	pWeight,
	rWeight,
	ingredientObject,
	EDITED
) => {
	const rPrice = ingredientObject.recipePrice;
	const newIngredientElement = document.createElement('li');
	newIngredientElement.className = 'ingredient-element';
	newIngredientElement.innerHTML = `
		<div class="ingredient-element__name grid">
			<h2>${name}</h2>
		</div>
		<div class="ingredient-element__info grid content-left">
			<div class="purchased-cost">
				<p><span class="ingredient__property-title">Base cost:</span> £${price}</p>
			</div>
			<div class="purchased-weight">
				<p><span class="ingredient__property-title">Base weight:</span> ${pWeight}g</p>
			</div>
			<div class="recipe-weight">
				<p><span class="ingredient__property-title">Recipe weight:</span> ${rWeight}g</p>
			</div>
			<div class="recipe-cost">
				<p><span class="ingredient__property-title">Recipe cost:</span> £${rPrice}</p>
			</div>
		</div>
	`;

	newIngredientElement.addEventListener(
		'click',
		openEditIngredientBtnHandler.bind(null, ingredientObject, false)
	);

	const listRoot = document.querySelector('.ingredient-list');
	if (EDITED) {
		const index = activeRecipe.ingredients.indexOf(activeIngredient);
		listRoot.children[index].replaceWith(newIngredientElement);
	} else {
		listRoot.append(newIngredientElement);
	}

	ingredientObject.element = newIngredientElement;
};

const addIngredientHandler = () => {
	const userInputs = activeModal.querySelectorAll('input');

	const name = userInputs[0].value ? userInputs[0].value : 'Name me';
	const purchasedPrice = parseInt(userInputs[1].value)
		? parseInt(userInputs[1].value)
		: 0;
	const purchasedWeight = parseInt(userInputs[2].value)
		? parseInt(userInputs[2].value)
		: 0;
	const recipeWeight = parseInt(userInputs[3].value)
		? parseInt(userInputs[3].value)
		: 0;

	const newIngr = {
		name: name,
		id: Math.random().toString(),
		purchasedPrice: purchasedPrice,
		purchasedWeight: purchasedWeight,

		recipePrice: 0,
		recipeWeight: recipeWeight,

		portionPrice: 0,
		portionWeight: 0,

		hasCalculated: false,
	};

	let num;
	let ingredientObject;
	num = activeRecipe.ingredients.push(newIngr);
	ingredientObject = activeRecipe.ingredients[num - 1];

	updateIngredientBaseCost();
	updatePurchasedTotals();
	updateRecipeTotals();

	checkactiveVsStagedRecipe();

	closeActiveModal();
	toggleBackdrop();
	clearIngredientInput();
	renderIngrElement(
		newIngr.id,
		newIngr.name,
		newIngr.purchasedPrice,
		newIngr.purchasedWeight,
		newIngr.recipeWeight,
		ingredientObject
	);

	// console.log('purchasedTotals PRICE: ' + activeRecipe.purchasedTotals.price);
	// console.log('purchasedTotals WEIGHT: ' + activeRecipe.purchasedTotals.weight);
	// console.log('ingr RECIPE PRICE: ' + activeRecipe.ingredients[num -1].recipePrice);
	// console.log('ingr RECIPE WEIGHT: ' + activeRecipe.ingredients[num -1].recipeWeight);
};

const openAddIngredientModalBtnHandler = () => {
	activeModal = addIngredientModal;
	const userInputs = activeModal.querySelectorAll('input');
	const addBtn = activeModal.querySelector('.add-ingredient__btn');
	const cancelBtn = activeModal.querySelector('.cancel-modal__btn');

	addBtn.addEventListener('click', addIngredientHandler);
	cancelBtn.addEventListener('click', cancelModalHandler);
	toggleBackdrop();
	addIngredientModal.classList.add('show');
};

const cancelAddIngredientHandler = () => {
	closeActiveModal();
	toggleBackdrop();
	clearIngredientInput();
};

// ======================= Edit ingredients ==============================

const saveEditIngredientHandler = () => {
	const userInputs = activeModal.querySelectorAll('input');

	const name = userInputs[0].value;
	const purchasedPrice = parseInt(userInputs[1].value);
	const purchasedWeight = parseInt(userInputs[2].value);
	const recipeWeight = parseInt(userInputs[3].value);

	activeIngredient.name = name;
	activeIngredient.purchasedPrice = purchasedPrice;
	activeIngredient.purchasedWeight = purchasedWeight;
	activeIngredient.recipeWeight = recipeWeight;

	renderIngrElement(
		activeIngredient.id,
		name,
		purchasedPrice,
		purchasedWeight,
		recipeWeight,
		activeIngredient,
		true
	);

	updateIngredientBaseCost();
	updatePurchasedTotals();
	updateRecipeTotals();

	checkactiveVsStagedRecipe();

	closeActiveModal();
	toggleBackdrop();
	clearIngredientInput();

	// console.log('purchasedTotals PRICE: ' + activeRecipe.purchasedTotals.price);
	// console.log('purchasedTotals WEIGHT: ' + activeRecipe.purchasedTotals.weight);
	// console.log('ingr RECIPE PRICE: ' + activeRecipe.ingredients[num -1].recipePrice);
	// console.log('ingr RECIPE WEIGHT: ' + activeRecipe.ingredients[num -1].recipeWeight);
};

const openEditIngredientBtnHandler = (ingredientObject, FROMDELETEMENU) => {
	activeModal = editIngredientModal;
	activeIngredient = ingredientObject;
	// const userInputs = activeModal.querySelectorAll('input');
	const saveBtn = activeModal.querySelector('.save__edit-ingredient__btn');
	const cancelBtn = activeModal.querySelector('.cancel-modal__btn');
	const deleteBtn = activeModal.querySelector('.delete__ingredient__btn');

	saveBtn.addEventListener('click', saveEditIngredientHandler);
	cancelBtn.addEventListener('click', cancelModalHandler);
	deleteBtn.addEventListener('click', openDeleteIngredientHandler);
	populateEditRecipeModal();
	editIngredientModal.classList.toggle('show');
	if (!FROMDELETEMENU) {
		toggleBackdrop();
	}
};

const cancelEditIngredientHandler = () => {
	toggleBackdrop();
	clearIngredientInput();
};

const populateEditRecipeModal = () => {
	const ingr = activeIngredient;
	const userInputs = activeModal.querySelectorAll('input');

	userInputs[0].value = ingr.name;
	userInputs[1].value = ingr.purchasedPrice;
	userInputs[2].value = ingr.purchasedWeight;
	userInputs[3].value = ingr.recipeWeight;
};

const closeIngredientDeletionModal = () => {
	toggleBackdrop();
	deleteIngredientModal.classList.toggle('show');
};

// ======================= Delete ingredient ==============================

const deleteIngredientHandler = () => {
	const index = activeRecipe.ingredients.indexOf(activeIngredient);
	activeRecipe.ingredients.splice(index, 1);
	const listRoot = document.querySelector('.ingredient-list');
	listRoot.children[index].removeEventListener(
		'click',
		openEditIngredientBtnHandler
	);
	listRoot.children[index].remove();

	updateIngredientBaseCost();
	updatePurchasedTotals();
	updateRecipeTotals();
	closeActiveModal();
	toggleBackdrop();
};

const openDeleteIngredientHandler = () => {
	closeActiveModal();
	clearIngredientInput();

	const deleteIngredientModal = document.querySelector(
		'.delete-ingredient-modal'
	);
	deleteIngredientModal.classList.add('show');
	activeModal = deleteIngredientModal;

	const cancelDeletionBtn = activeModal.querySelector('.btn--passive');
	let confirmDeletionBtn = activeModal.querySelector('.btn--danger');


	cancelDeletionBtn.addEventListener('click', () => {
		closeActiveModal();
		openEditIngredientBtnHandler(activeIngredient, true);
	});

	confirmDeletionBtn.addEventListener('click', deleteIngredientHandler);
};

// ======================= Add recipes ==============================

const openCreateRecipeModalHandler = () => {
	const nameInput = document.querySelector('.recipe-name');
	const confirmCreateRecipeBtn = document.querySelector('.create-recipe-btn');
	const cancelBtn = createRecipeModal.querySelector('.cancel-modal__btn');
	activeModal = createRecipeModal;

	confirmCreateRecipeBtn.addEventListener('click', confirmCreateRecipeHandler);
	cancelBtn.addEventListener('click', cancelModalHandler);
	toggleBackdrop();
	createRecipeModal.classList.toggle('show');
	activeModal.focus();
	// nameInput.focus();
	// confirmCreateRecipeBtn.focus();
};

const confirmCreateRecipeHandler = () => {
	const nameInput = document.querySelector('.recipe-name');
	const dropdownMenu = document.querySelector('.side-bar--recipes').children[1];
	const dropdownTitle = document.querySelector('.side-bar--recipes').children[0];

	const name = nameInput.value ? nameInput.value : 'Name me';

	const newRecipe = {
		name: name,
		id: Math.random().toString(),
		ingredients: [],
		purchasedTotals: {
			price: 0,
			weight: 0,
		},
		recipeTotals: {
			price: 0,
			weight: 0,
		},
	};

	recipes.push(newRecipe);
	// activeRecipe = newRecipe;
	closeActiveModal();
	toggleBackdrop();
	clearIngredientInput();
	if (!sideBarPlaceholder.classList.contains('show')) {
		toggleSideBar();
	}
	if (!dropdownMenu.classList.contains('show')) {
		dropdownTitle.click();
	}

	renderRecipeElement(newRecipe, name);
	clearIngredientInput();
	editRecipeHandler(newRecipe);
};

const renderRecipeElement = (recipe, name, reRender) => {
	const title = document.querySelector('.recipe-title').children[0];
	const newRecipeElement = document.createElement('li');

	title.textContent = name;
	name.replace(/^\w/, (c) => c.toUpperCase());
	newRecipeElement.innerHTML = `<p>${name}</p>`;
	newRecipeElement.classList.add('side-bar--list-item');
	recipe.element = newRecipeElement;

	newRecipeElement.addEventListener(
		'click',
		editRecipeHandler.bind(null, recipe)
	);

	const listRoot = document.querySelector('.recipe-list');
	if (reRender) {
		const element = activeRecipe.element.children[1];

		if (element) {
			element.remove();
		}
		listRoot.children[recipes.indexOf(recipe)].replaceWith(newRecipeElement);
		activeRecipe.element.classList.add('active');
		pulseAnimation(newRecipeElement);
	} else {
		listRoot.append(newRecipeElement);
		pulseAnimation(newRecipeElement);
	}
};

// ======================= Edit recipes ==============================

const editRecipeHandler = (recipe) => {
	const listRoot = document.querySelector('.ingredient-list');
	const toolBar = document.querySelector('.tool-bar');
	const title = document.querySelector('.recipe-title').children[0];

	title.textContent = recipe.name;
	toolBar.classList.add('show');

	// modifies previous recipe in preperation for the next
	if (activeRecipe) {
		activeRecipe.element.classList.remove('active');
		activeRecipe.hasCalculated = false;
	}

	activeRecipe = recipe;
	activeRecipe.element.classList.add('active');

	// removes previous recipe ingredient elements from UI
	while (listRoot.hasChildNodes()) {
		listRoot.removeChild(listRoot.firstChild);
	}

	// adds selected recipe ingredient elements to UI
	for (const key in activeRecipe.ingredients) {
		listRoot.append(activeRecipe.ingredients[key].element);
	}
};

const startRenameRecipeBtnHandler = () => {
	const dropdownMenu = document.querySelector('.side-bar--recipes').children[1];
	const dropdownTitle = document.querySelector('.side-bar--recipes').children[0];
	let delay = 0;
	if (activeRecipeRenaming) {
		return;
	}

	if (!sideBar.classList.contains('show')) {
		delay = 300;
		toggleSideBar();
	}
	if (!dropdownMenu.classList.contains('show')) {
		delay = 300;
		dropdownTitle.click();
	}

	activeRecipeRenaming = true;

	const recipe = activeRecipe;
	const element = recipe.element.children[0];
	const top = element.offsetTop;
	const left = element.offsetLeft;
	const newInput = document.createElement('input');

	newInput.value = recipe.name;
	newInput.setAttribute('type', 'text');
	newInput.className = 'recipe-rename-input';
	newInput.style.top = `${top + 8}px`;
	newInput.style.left = `${left - 10}px`;


	setTimeout(function(){ 
		sideBar.before(newInput);
		newInput.select();
	
		const invisibleBackdrop = document.createElement('div');
		invisibleBackdrop.className = 'backdrop-invisible';
		newInput.before(invisibleBackdrop);
	
		invisibleBackdrop.addEventListener('click', invisibleBackdropHandler);
	 }, delay);

};

const closeRecipeRename = () => {
	document.querySelector('.backdrop-invisible').remove();
	document.querySelector('.recipe-rename-input').remove();
};

const renameRecipe = () => {
	const input = document.querySelector('.recipe-rename-input');
	const element = activeRecipe.element;
	const name = input.value ? input.value : 'Name me';

	activeRecipe.name = name;
	closeRecipeRename();
	renderRecipeElement(activeRecipe, name, true);
	activeRecipeRenaming = false;
};

const invisibleBackdropHandler = () => {
	closeRecipeRename();
	activeRecipeRenaming = false;
};

const deleteRecipeHandler = () => {
	const index = recipes.indexOf(activeRecipe);
	recipes.splice(index, 1);
	const listRoot = document.querySelector('.recipe-list');
	listRoot.children[index].removeEventListener(
		'click',
		editRecipeHandler
	);

	const nextRecipe = recipes[index] ? recipes[index] : recipes[index - 1];
	if (nextRecipe) {
		editRecipeHandler(nextRecipe);
	} else {
		document.querySelector('.tool-bar').classList.remove('show');
		document.querySelector('.ingredient-list').textContent = '';
		
		console.log('close bits');
	}
	
	listRoot.children[index].remove();

	// updateIngredientBaseCost();
	// updatePurchasedTotals();
	// updateRecipeTotals();
	closeActiveModal();
	toggleBackdrop();



}

const startDeleteRecipeBtnHandler = () => {
	const modal = document.querySelector('.delete-ingredient-modal');
	toggleBackdrop();
	modal.classList.add('show');

	activeModal = modal;

	const cancelBtn = activeModal.querySelector('.btn--passive');
	const confirmBtn = activeModal.querySelector('.btn--danger');


	cancelBtn.addEventListener('click', () => {
		closeActiveModal();
		toggleBackdrop();
	});

	confirmBtn.addEventListener('click', deleteRecipeHandler);
};

const keypressChecker = (event) => {
	if (activeModal.classList.contains('show')) {
		if (event.key === 'Escape') {
			event.preventDefault();
			activeModal.querySelector('.btn--passive').click();
		}

		if (event.key === 'Enter') {
			event.preventDefault();
			activeModal.querySelector('.btn--primary').click();
		}

		if (event.key === 'Delete') {
			event.preventDefault();
			if (activeModal.querySelector('.delete__ingredient__btn')) {
				activeModal.querySelector('.delete__ingredient__btn').click();
			}
		}
	}

	if (!activeModal.classList.contains('show')) {
		if (
			(event.ctrlKey && event.altKey && event.key === 'n') ||
			(event.ctrlKey && event.altKey && event.key === 'N')
		) {
			event.preventDefault();
			openCreateRecipeModalBtn.click();
		}
	}



	if (!activeModal) {
		if (!activeModal.classList.contains('show')) {
			if (
				(event.ctrlKey && event.altKey && event.key === 'n') ||
				event.key === 'N'
			) {
				event.preventDefault();
				openCreateRecipeModalBtn.click();
			}
		}
	}

	if (activeRecipe) {
		if (!activeModal.classList.contains('show')) {
			if (
				(event.ctrlKey && event.altKey && event.key === 'm') ||
				event.key === 'M'
			) {
				console.log('AOSEIFHSODUFHOFHU');
				event.preventDefault();
				openAddIngredientModalBtn.click();
			}
		}
	}

	if (activeRecipeRenaming) {
		if (event.key === 'Enter') {
			event.preventDefault();
			renameRecipe();
		}
	}
};
sidebarCategoryBtnHandler();
// populateApp();
// updateIngrRecipeFigures();
// updatePurchasedTotals();
// updateRecipeTotals();

//

openAddIngredientModalBtn.addEventListener(
	'click',
	openAddIngredientModalBtnHandler
);
startRenameRecipeBtn.addEventListener('click', startRenameRecipeBtnHandler);
startDeleteRecipeBtn.addEventListener('click', startDeleteRecipeBtnHandler);


backdrop.addEventListener('click', backdropClickHandler);
openCreateRecipeModalBtn.addEventListener(
	'click',
	openCreateRecipeModalHandler
);
sidebarToggleBtn.addEventListener('click', toggleSideBar);
calculateBtn.addEventListener('click', calculateBtnHandler);
radioItemWeight.addEventListener('click', () => {
	const btn = weightRadioBtn;
	btn.checked = true;
	portionTextInput.placeholder = '300(g)';
});
radioItemEqual.addEventListener('click', () => {
	const btn = equalRadioBtn;
	btn.checked = true;
	portionTextInput.placeholder = '6 (portions)';
});

window.addEventListener('keydown', keypressChecker, false);
