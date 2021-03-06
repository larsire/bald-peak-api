import * as newsService from '../services/newsService';
import * as imageService from '../services/imageService';
import * as express from 'express';
import News from "../models/newsModel";
import extRequest from '../models/extenderRequestModel';

async function getNewsList(req: express.Request, res: express.Response) {
    let data = await newsService.getNews();
    return res.status(200).send(data);
}

async function getNewsById(req: express.Request, res: express.Response) {
    let data = await newsService.getNewsById(req.params.id);
    return res.status(200).send(data);
}

async function insertNews(req: extRequest, res: express.Response) {
    try {
        let newNews = new News(req.body, {id: req.user.id});
        newNews.id = await newsService.getLastId() + 1;
        if (req.body.image) {
            newNews.avatarId = await imageService.insertImage(req.body.image);
        }
        let data = await newsService.insertNews(newNews);
        return res.status(200).send(data);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Invalid request');
    }
}

async function updateNews(req: express.Request, res: express.Response) {
    let data = await newsService.updateNews(req.params.id, req.body);
    return res.status(200).send(data);
}

async function removeNews(req: express.Request, res: express.Response) {
    const imageData = await newsService.getNewsById(req.params.id);
    if (!imageData) {
        return res.status(404).send();
    }
    if (imageData.avatarId) {
        await imageService.removeImage(imageData.avatarId);
    }

    await newsService.removeNews(req.params.id);
    return res.status(200).send();
}

export {
    getNewsList,
    getNewsById,
    insertNews,
    updateNews,
    removeNews
}
