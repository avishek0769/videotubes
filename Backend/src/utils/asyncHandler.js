// Approach - 2 - We will use this
// const asyncHandler = (fn) => {
//     return (req, res, next) => {
//         Promise.resolve(fn(req, res, next)).catch((error)=>{
//             next(error)
//         })
//     }
// }
// Approach - 3
// const asyncHandler = async (fn) => {
//     return async (req, res, next) => {
//         await fn(req, res, next).catch((error)=>{
//             next(error)
//         })
//     }
// }



// Approach - 1
const asyncHandler = (fn) => async (req, res, next) => { 
    try {
        await fn(req, res, next)
    } catch (error) {
        next(error)
    }
}
/* 
The above func this taking a function as parameter and returning another async function which is taking the 
parameters of (req, res, next) and this function will execute the "fn" in the try block with the arguments 
which the above returned func has taken as paramaters (req, res, next)

This function will be called as like this -> 
app.get('/example', asyncHandler(exampleAsyncHandler));

If we see the behind mechanism of the above example, it will be like this ->

step-1: app.get('/example', asyncHandler(exampleAsyncHandler));

step-2: app.get('/example', async (req, res, next) => { 
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    });

Now you can understand that giving req, res, next as parameters in the returned function of asyncHandler is 
absolutely fine because it will be replaced with the callback func in the route handler
*/

export { asyncHandler }