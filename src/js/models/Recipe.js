import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
            // console.log(result);
        } catch(error) {
            console.log(error);
            alert('Something went wrong :c');
        }
    }

    calcTime() {
        // 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds']; // The plural 'ounces' and 'teaspoons' must be listed before their singular counterpart otherwise the algorithm will read the 'ounce' in 'ounces' and same for 'teaspoon'
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' '); // split each ingredient into its own array
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2)); // tests to see if the current element is included in the unitsShort array, then returns the index of that element in the arrIng array.

            let objIng;
            if (unitIndex > -1) {
                // There is a unit AND a number
                const arrCount = arrIng.slice(0, unitIndex); // Ex. 2 1/2 cups, arrCount is [4, 1/2] --> count is eval('4+1/2') --> 4.5
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but the 1st element is a number

                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') // slices out first element, then joins array back into a string
                };

            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st element

                objIng = {
                    count: 1,
                    unit: '',
                    ingredient // same thing as ingredient: ingredient
                };
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        })

        this.servings = newServings;
    }
}