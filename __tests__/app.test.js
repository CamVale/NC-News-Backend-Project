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
const toBeSorted = require('jest-sorted')


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
          body: expect.any(String),
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


describe('GET /api/articles/:article_id/comments', () => {
  test('should return a 200 status code and an array of comments on the given article at  article_id - with correct keys on ojects', () => {
      const pathID = '1'
      return request(app)
        .get(`/api/articles/${pathID}/comments`)
        .expect(200)
        .then((response) => {
          expect(response.body.comments.length).toBe(11);
          response.body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            });
          });
        });
    });
    test('array should be sorted in descending order', () => {
      const pathID = '1'
      return request(app)
        .get(`/api/articles/${pathID}/comments`)
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toBeSorted({
            key: "created_at",
            coerce: true,
            descending: true,
          })
        })
    });
    test('should return a 404 error if queried with a non-existent article_id (article doesnt exist)', () => {
      const pathID = '100'
      return request(app)
        .get(`/api/articles/${pathID}/comments`)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found")
        })
    });
    test('should return a 400 error if queried with an invalid id', () => {
      const pathID = 'pigeon'
      return request(app)
        .get(`/api/articles/${pathID}/comments`)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request")
        })
    });
    test('should return an empty array if article exists but has no comments', () => {
      const pathID = '2'
      return request(app)
        .get(`/api/articles/${pathID}/comments`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.comments)).toBe(true);
          expect(response.body.comments.length).toBe(0);
        })
    });
  });

describe("GET /api/articles", () => {
  test("should return status code 200, and an array of all article objects, with a comment_count key included, and body key omitted", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((topic) => {
          expect(topic).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test('comment count property should be accurate', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response)=>{
      const index = response.body.articles.findIndex(
        (article) => article.article_id === 1
      );
      expect(response.body.articles[index].comment_count).toBe(11)
    })
  });
  test('array should be sorted by date in descending order', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response)=>{
      expect(response.body.articles).toBeSorted({
        key: "created_at",
        coerce: true,
        descending: true,
      });
    })
  });
});

describe("GET /api/articles/:topic/topics", () => {
  test("should return status code 200 and an object containing the article of the given id", () => {
    const topicQuery = "mitch";
    return request(app)
      .get(`/api/articles/topics/${topicQuery}`)
      .expect(200)
      .then((response) => {
        expect(response.body.returnedArticles.length).toBe(12)
        response.body.returnedArticles.forEach((article)=>{
        expect(article.topic).toBe("mitch")
      });
    })
  });
  test('should return a 200 status code and all articles if queried with no topic', () => {
    return request(app)
    .get("/api/articles/topics/")
    .expect(200)
    .then((response) => {
      expect(response.body.articles.length).toBe(13);
      response.body.articles.forEach((topic) => {
        expect(topic).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
    });
  });
  test('should return a 404 error when queried with a non-existent topic', () => {
    const topicQuery = '100'
      return request(app)
        .get(`/api/articles/topics/${topicQuery}`)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found")
        })
  });
})
