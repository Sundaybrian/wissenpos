const cursorMixin = require("objection-cursor");

const cursor = cursorMixin({
    limit: 100, // Default limit in all queries
    results: true, // Page results
    nodes: false, // Page results where each result also has an associated cursor
    pageInfo: {
        // When true, these values will be added to `pageInfo` in query response
        total: true, // Total amount of rows
        remaining: true, // Remaining amount of rows in *this* direction
        remainingBefore: false, // Remaining amount of rows before current results
        remainingAfter: false, // Remaining amount of rows after current results
        hasMore: true, // Are there more rows in this direction?
        hasNext: true, // Are there rows after current results?
        hasPrevious: true, // Are there rows before current results?
    },
});

module.exports = cursor;
