const app = require("../app/app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const json = require("../endpoints.json");
const { convertTimestampToDate } = require("../db/seeds/utils");

beforeEach(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("should respond with 200 status code and array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("GET /api", () => {
  test("should respond with a 200 status code and an object describing all possible endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject(json);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should return status code 200 and an object containing the article of the given id", () => {
    const pathID = "2";
    return request(app)
      .get(`/api/articles/${pathID}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: convertTimestampToDate(1602828180000),
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("should return an error 404 if queried with an non-existent id", () => {
    const pathID = "200";
    return request(app)
      .get(`/api/articles/${pathID}`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("should return an error 400 if queried with an invalid id", () => {
    const pathID = "pigeon";
    return request(app)
      .get(`/api/articles/${pathID}`)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should insert the new comment into the db and return the posted comment object", () => {
    const timestamp = new Date(Date.now())
    const pathID = 2
    const newComment = {
      username: "rogersop",
      body: "its beginning to look a lot like christmas!"
    }
    return request(app)
      .post(`/api/articles/${pathID}/comments`)
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "its beginning to look a lot like christmas!",
          votes: 0,
          author: "rogersop",
          article_id: pathID,
          created_at: expect.any(String),
        });
      });
  });
  test('should return a 400 error if request not passed required fields', () => {
    const pathID = '2'
    const newComment = {
      username: "rogersop",
    };
    return request(app)
      .post(`/api/articles/${pathID}/comments`)
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request')
      });
  });
  test('should return a 400 error if request passed an invalid id', () => {
    const pathID = 'pigeon'
    const newComment = {
      username: "rogersop",
      body: "hi there"
    };
    return request(app)
      .post(`/api/articles/${pathID}/comments`)
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request')
      });
  });
  test('should return a 404 error if request passed a non-existent id', () => {
    const pathID = '200'
    const newComment = {
      username: "rogersop",
      body: "lots of love <3"
    };
    return request(app)
      .post(`/api/articles/${pathID}/comments`)
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Not Found')
      });
  });
  test('should return a 404 error if username does not exist', () => {
    const pathID = '2'
    const newComment = {
      username: "beepboopbop",
      body: "need a cuppa"
    };
    return request(app)
      .post(`/api/articles/${pathID}/comments`)
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Not Found')
      });
  });
  });
