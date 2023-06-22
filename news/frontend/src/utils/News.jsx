import { VariablesAreInputTypesRule } from "graphql";
import httpClient from "../httpclient";

class News {
    static months = [
        "jan", 
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "july",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
    ]
    static base = "https://www.nytimes.com"
    
    /** 
     * Format the date
     * 
     * @param string article
     * @param boolean raw - raw date
     * @return string - required date
     * */ 
    static getDate(article = null, raw = false) {
        var date;
    
        if (!article) return "";

        if (article) {
            date = article.webPublicationDate || article.publishedAt || article.pub_date || article
        }
        var d = new Date(date), valid;

        if (raw) {
            valid = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
        } else {
            valid = `${d.getDate()} ${this.months[d.getMonth()]} ${d.getFullYear()}`
        }
        return valid;
    }

    /**
     * Submits the form to the server using httpClient
     * 
     * @param String to - Relative Url
     * @param String form - An HTML Form or Data to submit 
     * @param function callback - callback function on success
     * @param function fallback - fallback function on error
     */
    static submit(to, form, callback = (data) => { }, fallback = ( response ) => {}) {
        let payload = this.has(form, "tagName")? new FormData(form): form

        httpClient
            .post(to, payload)
            .then((data) => callback(data.response || data))
            .catch(error => fallback(error))
    }

    /**
     * Checks if given item has that property
     * 
     * @param object which - Which object
     * @param object what - what property
     * @returns boolean - true if it has, false otherwise
     */
    static has(which, what) {
        return which ? which.hasOwnProperty(what) : false;
    }

    /**
     * Removes HTML tags from given string
     * 
     * @param String str - string to strip
     * @returns String - stripped string
     */
    static stripTags(str = "") {
        return typeof str==="string" ? str.replace(/(<([^>]+)>)/gi, "") : "";
    }

    /**
     * Loads data from server, uses get
     * 
     * @param String to - Relative URL to load data from
     * @param function callback
     * @param function fallback 
     */
    static load(_from, callback = (data) => { }, fallback = (err) => { }) {
        httpClient
            .get(_from)
            .then((data) => {
                let result = data && data.hasOwnProperty("response") ? data.response : data;
                callback(result);
            }) 
            .catch((error) => fallback(error))
    }

    /**
     * Makes string titlecase
     * 
     * @param String str 
     * @returns String - titled
     */
    static title(str = "") {
        return str.length <= 1? 
        str.toUpperCase() : str.charAt(0).toUpperCase() + str.substring(1, str.length)
    }

    /**
     * Makes URL complete, pointing to valid image
     * 
     * @param String url - url, can be relative
     * @returns String - valid url link
     */
    static validImage(url = "") {
        if (!url) return "";
        return url.startsWith("http") || url.length < 1? url: `${this.base}/${url}`
    }

    /**
     * Removes slashes from given string
     * 
     * @param String str - String to unslash
     * @returns String unslashed
     */
    static unslash(str = "") {
        if (str) str = str.toString();
        return typeof str === "string"? str.replace(/^\/|\/$/g, '') : "";
    }

    /**
     * Get thumbnail image data from article
     * 
     * @param object article 
     * @returns String - valid image data from article
     */
    static getThumbnail(article, direct = false) {
        var
            thumbnail = {
                url: "",
                caption: "",
                width: 150,
                height: 150
            },
            multimedia = this.extract(article, "multimedia");

        if (Array.isArray(multimedia)) {
            if (multimedia.length > 2) {
                thumbnail = multimedia[2]
            }
            else if (multimedia.length > 0) {
                thumbnail = multimedia[0]
            }
        } else {
            if (this.has(article, "fields")) {
                thumbnail.url = article.fields.thumbnail
            }
            else {
                thumbnail.url = article.urlToImage
            }
        }
    
        thumbnail.width = 150
        thumbnail.height = 150

        return direct? this.validImage(thumbnail.url) : thumbnail
    }

    /**
     * Get the article Author
     * 
     * @param object article 
     * @returns String - byline/author text
     */
    static getByline(article = {}) {
        var byline = this.extract(article, "byline", "original")
        
        if (! byline ) byline = article.byline || article.author || "";
        if (this.has(byline, "original")) {
            byline = byline.original
        }
        
        return byline
    }

    /**
     * Gets the abstract line from article
     * 
     * @param object article 
     * @returns String abstract line with no tags
     */
    static getAbstract(article) {
        if (!article) return "";
        var 
            _abstract = this.extract(article, "fields", "standfirst") ||
                article.abstract ||
                article.description ||
                ""
        return this.stripTags(_abstract);
    }

    static extract(item, _field, inner = null) {
        var field = "";

        /* 
         * this.has() also checks false or true, 
         * but runs algorithm, so check first for nulls to reduce cost
         */
        if (item && this.has(item, _field)) {
            if (inner && this.has(item[_field], inner)) {
                field = item[_field][inner];
            }
            else {
                field = item[_field]
            }
        } 
        return field;
    }
    
    /**
     * Get title from article
     * 
     * @param object article 
     * @returns string title
     */
    static getTitle(article = {}) {
        var
            title = this.extract(article, "headline", "main") || article.webTitle || article.title || "";
        
        if (this.has(article, "fields")) {
            title = this.extract(article, "fields", "headline")
        }

        return title;
    }

    /**
     * Gets the section name from article
     * 
     * @param object article 
     * @returns String section name
     */
    static getSection(article) {
        var section = article.pillarName || article.subsection || "General"
        return section;
    }

    /**
     * Gets URL from article
     * 
     * @param object article 
     * @returns string url or empty string
     */
    static getUrl(article) {
        return article.webUrl || article.url || article.web_url || "";
    }

    /**
     * Gets body from article
     * 
     * @param object article 
     * @returns String body
     */
    static getBody(article) {
        var html = this.extract(article, "fields", "body") || article.content || article.snippet || "";
        
        return html || "No content";
    }

    /**
     * Gets the leading paragraph from article
     * 
     * @param Object article 
     * @returns String paragraph or empty
     */
    static getLeadParagraph(article) {
        return article.lead_paragraph || article.description || "empty";
    }
	
}

export default News