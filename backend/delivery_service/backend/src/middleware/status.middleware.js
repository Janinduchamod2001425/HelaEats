export const validateStatusUpdate = (req, res, next) => {
    const validStatuses = [
        "preparing",
        "assigned",
        "accepted",
        "on_the_way",
        "nearby",
        "delivered",
        "cancelled"
    ];

    if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({
            error: `Invalid status. Valid values: ${validStatuses.join(', ')}`
        });
    }
    next();
};