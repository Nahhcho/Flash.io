import { Fields, Files } from "formidable";
import { IncomingForm } from "formidable";
import { IncomingMessage } from "http";

export async function parseForm(req: IncomingMessage)
: Promise<{fields: Fields, files: Files | null }> {

    const form = new IncomingForm({
        multiples: true,
        keepExtensions: false
    });

    const { fields, files }: {
        fields: Fields,
        files?: Files | null
    } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files?) =>{
            if (err) return reject(err);
            resolve({ fields, files })
        })
    })

    return files ? { fields, files } : { fields, files: null };
}