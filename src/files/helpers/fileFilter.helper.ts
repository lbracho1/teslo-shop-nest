

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    // console.log({ file });
    if (!file) return callback(new Error('File is ampty'), false);

    const fileExptension = file.mimetype.split('/')[1];
    const fileAcceptance = ['jpg', 'jpeg', 'png', 'gif'];

    if (fileAcceptance.includes(fileExptension)) {
        return callback(null, true)
    }

    callback(null, false);

}