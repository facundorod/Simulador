export class HelperService {
    /**
     * Return query string
     */
    static getQueryString(query: any) {
        if (!query) return null;
        let queryString = "";

        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                if (query[key] !== null && query[key] !== "") {
                    if (queryString) queryString += "&";
                    queryString += key + "=" + query[key];
                }
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
