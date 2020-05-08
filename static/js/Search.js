class Search {
    constructor(sections) {
        const list = Object.keys(sections).map(k => sections[k][0])
        this.fuse = new Fuse(list, {
            includeScore: true,
            keys: ['title', 'subtitle', 'h2s', 'h3s', 'content']
        })
        this.form = document.querySelector('form')
        this.input = document.querySelector('input[name="query"]')
        this.addListener()
    }

    addListener() {
        document.addEventListener('DOMContentLoaded', this.onLoad.bind(this))
        this.form.addEventListener('keydown', this.onSearch.bind(this))
    }

    buildSearchResult(result) {
        return `
            <h2 class="search-results__result-title">${result.item.title}</h2>
            <div class="search-results__result-path">${result.item.link}</div>
            <div class="search-results__result-description">${this.stripTags(this.stripTags(result.item.content))?.substring(0, 100)}…</div>
        `
    }

    buildSearchResults(results) {
        return this.buildWrapper(results.map(result => this.buildSearchResult(result)).join('\n'))
    }

    search(query) {
        const results = this.fuse.search(query)

        this.emptySearchResults()

        if (results.length) {
            this.form.insertAdjacentElement('afterend', this.buildSearchResults(results))
        } else {
            this.form.insertAdjacentElement('afterend', this.buildWrapper(`No results for “${this.input.value}”`))
        }
    }

    onLoad() {
        if (!document.location.search) return

        const query = decodeURI(document.location.search.substring(1).split('=')[1])

        if (!query) return

        this.input.value = query
        this.search(query)
    }
    
    onSearch(e) {
        if (e.keyCode === 13) {
            e.preventDefault()
            this.search(this.input.value)
        }
    }

    emptySearchResults() {
        const results = document.querySelector('.search-results')
        results?.parentNode.removeChild(results)
    }

    buildWrapper(str) {
        return this.parseFromString(`<div class="search-results">${str}</div>`)
    }

    parseFromString(html) {
        return new DOMParser().parseFromString(html, 'text/xml').firstChild
    }

    stripTags(html) {
        return html.replace(/(<([^>]+)>)/ig, '')
    }
}
