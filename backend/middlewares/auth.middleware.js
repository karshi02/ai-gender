function requireAdmin(req, res, next) {
    if (req.session.isAdmin) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = { requireAdmin };