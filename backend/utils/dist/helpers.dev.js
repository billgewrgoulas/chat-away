"use strict";

var mongoose = require('mongoose');

var User = require('../models/User');

require('dotenv/config');

var jwt = require("jsonwebtoken");

var Room = require('../models/Room');

module.exports = {
  //encode sensitive data before sending to the client for storage
  encodeData: function encodeData(data) {
    return jwt.sign({
      name: data.name,
      email: data.email,
      id: data._id,
      avatar: data.avatar
    }, process.env.SESSION_SECRET, {
      expiresIn: '3600s'
    });
  },
  saveComment: function saveComment(comment) {
    var id1, id2;
    return regeneratorRuntime.async(function saveComment$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id1 = comment.sender + comment.receiver;
            id2 = comment.receiver + comment.sender;

            if (comment.receiver == process.env.PUBLIC_ROOM) {
              id1 = process.env.PUBLIC_ROOM;
              id2 = process.env.PUBLIC_ROOM;
            }

            _context.next = 5;
            return regeneratorRuntime.awrap(Room.updateOne({
              $or: [{
                roomId: id1
              }, {
                roomId: id2
              }]
            }, {
              $push: {
                comments: comment
              }
            })["catch"](function (err) {
              console.log(err);
            }));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  updateAvatar: function updateAvatar(url, email) {
    return regeneratorRuntime.async(function updateAvatar$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(User.updateOne({
              email: email
            }, {
              $set: {
                avatar: url
              }
            })["catch"](function (err) {
              console.log(err);
            }));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};