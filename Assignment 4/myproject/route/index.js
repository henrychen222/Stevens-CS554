const userRoutes = require('./server');

const constructorMethod = (app) => {
    
    //app.use('/server', userRoutes);      //wrong
    app.use('/', userRoutes);
    
    app.use("*", (req, res) => {
        res.status(404).json({error: "Page not found"});
    });
}

module.exports = constructorMethod;