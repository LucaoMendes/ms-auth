import express, { Request , Response , NextFunction} from "express";

const app = express();

app.get('/status',(req: Request,res : Response,next : NextFunction) => {
    console.log("Status")
    res.status(200).send({
        foo : 'Sucesso Total'
    })
})

app.listen(80,()=>console.log("Aplicação iniciada na porta 80"))