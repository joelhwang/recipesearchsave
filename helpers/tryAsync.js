//wraps a function in a try catch function.
//if anything goes wrong in the passed function, 
//catch the error and pass it to next
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}