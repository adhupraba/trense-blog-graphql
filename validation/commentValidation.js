module.exports.commentValidation = (body) => {
    const errors = {}
    
    if (body.trim() === '') {
        errors.comment = 'Comment body must not be empty'
    }
    
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}