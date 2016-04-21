module.exports = {

    sort: function (data, field) {
        var descending = field.indexOf('-') === -1;
        var trimmed = field.replace('-', '');

        var sorters = {
            id: function (a, b) {
                return descending ? a.id > b.id : a.id < b.id;
            },
            content: function (a, b) {
                return descending ? a.content.localeCompare(b) : b.content.localeCompare(a)
            }
        };

        return data.sort(sorters[trimmed]);
    }
}