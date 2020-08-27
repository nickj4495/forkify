import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        // const proxy = 'https://cors-anywhere.herokuapp.com/';
        try {
            const result = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = result.data.recipes;
            // console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}