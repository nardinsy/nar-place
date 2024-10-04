import { CommentAction } from "../helpers/dtos";
import { IUser } from "./local-storage-types";
const user1ProfilePicture =
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const user2ProfilePicture =
  "https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=600";
const user1PlacePicture =
  "https://images.pexels.com/photos/5620964/pexels-photo-5620964.jpeg?auto=compress&cs=tinysrgb&w=600";
const user2PlacePicture =
  "https://images.pexels.com/photos/1174138/pexels-photo-1174138.jpeg?auto=compress&cs=tinysrgb&w=600";

const initialUsers: IUser[] = [
  {
    email: "user1@gmail.com",
    newNotifications: [
      {
        kind: "Comment",
        from: {
          userId: "2",
          username: "User 2",
          pictureUrl: user2ProfilePicture,
          placeCount: 1,
        },
        commentContent: {
          placeId: "22",
          commentId: "2222",
          action: CommentAction.LikeComment,
        },
      },
    ],
    oldNotifications: [
      {
        kind: "Comment",
        from: {
          userId: "2",
          username: "User 2",
          pictureUrl: user2ProfilePicture,
          placeCount: 1,
        },
        commentContent: {
          placeId: "11",
          commentId: "1111",
          action: CommentAction.WriteComment,
        },
      },
    ],
    password: "1234",
    picture: user1ProfilePicture,
    userId: "1",
    username: "User 1",
    places: [
      {
        address: "Zürich, ZH, Switzerland",
        creator: "1",
        placeId: "11",
        title: "Train passing",
        description:
          "A beautiful train passing through Zürich, showcasing the charm and efficiency of Switzerland's iconic public transit.",
        comments: [
          {
            date: "Wed Oct 02 2024",
            id: "1111",
            parentId: undefined,
            likes: [],
            postID: "11",
            replies: [
              {
                id: "3",
                parentId: "1111",
                text: "reply",
                date: "Wed Oct 02 2024",
                postID: "11",
                writer: {
                  userId: "1",
                  username: "User 1",
                  pictureUrl: user1ProfilePicture,
                  placeCount: 1,
                },
                likes: [],
                replies: [],
              },
            ],
            text: "comment",
            writer: {
              userId: "2",
              username: "User 2",
              pictureUrl: user2ProfilePicture,
              placeCount: 1,
            },
          },
        ],
        picture: user1PlacePicture,
      },
    ],
  },
  {
    userId: "2",
    username: "User 2",
    email: "user2@gmail.com",
    password: "1234",
    places: [
      {
        placeId: "22",
        title: "Bolivian Amazon Jungle",
        description:
          "Serene Amazon Rainforest with Lush Greenery Reflected in River",
        address: "Manaus, AM, Brasil",
        comments: [
          {
            date: "Wed Oct 02 2024",
            id: "2222",
            postID: "22",
            likes: [{ commentId: "2222", userId: "2" }],
            replies: [],
            text: "comment",
            writer: {
              userId: "1",
              username: "User 1",
              pictureUrl: user1ProfilePicture,
              placeCount: 1,
            },
            parentId: undefined,
          },
        ],
        creator: "2",
        picture: user2PlacePicture,
      },
    ],
    picture: user2ProfilePicture,
    oldNotifications: [
      {
        kind: "Comment",
        from: {
          userId: "1",
          username: "User 1",
          pictureUrl: user1ProfilePicture,
          placeCount: 1,
        },
        commentContent: {
          placeId: "22",
          commentId: "2222",
          action: CommentAction.WriteComment,
        },
      },
    ],
    newNotifications: [
      {
        kind: "Comment",
        from: {
          userId: "1",
          username: "User 1",
          pictureUrl: user1ProfilePicture,
          placeCount: 1,
        },
        commentContent: {
          placeId: "11",
          commentId: "1111",
          action: CommentAction.ReplyComment,
        },
      },
    ],
  },
];

export { initialUsers };
