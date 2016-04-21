module.exports = {
    /**
     * Sorts sequences using json api style field names.
     * @see http://jsonapi.org/format/#fetching-sorting
     *
     * @param data {Array} The sequences to sort.
     * @param field {String} The name of the field to sort. Prefixing a minus sign indicates ascending sort order.
     * @returns {Array} The sorted data.
     */
    sort: function (data, field) {
        // Find the sort order.
        var descending = field.indexOf('-') === -1;
        // Remove the minus sign if exists.
        var trimmed = field.replace('-', '');

        return data.sort(function (a, b) {
            var A = a[trimmed];
            var B = b[trimmed];
            // Take strings to lowercase to help out.
            if (typeof A === 'string') {
                A = A.toLowerCase();
                B = B.toLowerCase();
            }
            return descending ? A > B : A < B;
        });
    }
};