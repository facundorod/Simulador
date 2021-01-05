export class HelperService {
    /**
     * Return query string
     */
    static getQueryString(query: any) {
        if (!query) return null;
        let queryString = "";

        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                if (query[key] !== null && query[key] !== '') {
                    if (queryString) queryString += "&";
                    queryString += key + "=" + query[key];
                }
            }
        }

        return queryString;
    }

    /**
     * Return query string to be used in search
     * For example, from JSON object it will return:
     * `property1:value1|property2:value2|property3:value3`
     * @param query
     */
    static getQueryStringForSearch(query: any) {
        if (!query) return null;

        let queryString = "";
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                if (queryString) queryString += "|";
                queryString += key + "," + query[key];
            }
        }

        return queryString;
    }

    /**
     * Return query string
     * @param query
     */
    static getOrderQueryString(query: { orderBy: string; order: string }) {
        if (!query) return null;

        let _return = `orderBy=${
            query.orderBy
        }&order=${query.order.toUpperCase()}`;

        return _return;
    }
}
