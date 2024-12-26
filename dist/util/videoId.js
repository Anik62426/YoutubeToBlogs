"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYouTubeVideoID = void 0;
const getYouTubeVideoID = (url) => {
    const regex = /(?:\?v=|&v=|\/v\/|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};
exports.getYouTubeVideoID = getYouTubeVideoID;
