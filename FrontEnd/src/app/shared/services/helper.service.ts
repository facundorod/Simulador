export class HelperService {

    /**
     * Return query string
     */
    static getQueryString(query: any) {
        if (!query)
            return null;

        let queryString = '';
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                if (query[key] !== null) {
                    if (queryString)
                        queryString += '&';
                    queryString += key + '=' + query[key];
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
        if (!query)
            return null;

        let queryString = '';
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                if (queryString)
                    queryString += '|';
                queryString += key + ',' + query[key];
            }
        }

        return queryString;
    }

    /**
     * Return query string
     * @param query
     */
    static getOrderQueryString(query: { orderBy: string, order: string }) {

        if (!query)
            return null;

        const fields = (query.orderBy.split('|'));
        if (fields.length > 0) {
            let _return = 'order=';
            for (let i = 0; i < fields.length; i++) {
                _return += `${fields[i]}:${query.order}`;
                if (i + 1 < fields.length)
                    _return += `|`;
            }
            return _return;
        }
        else
            return '';
    }
}
