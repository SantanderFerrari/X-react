"use client";

import { HiDotsHorizontal, HiOutlineHeart, HiHeart } from "react-icons/hi";
import Icons from "./Icons";
import { useState, useEffect } from "react";
import { getFirestore, onSnapshot, collection, setDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { app } from "@/firebase";
import Image from "next/image";

export default function Comment({ comment, commentId, originalPostId }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const db = getFirestore(app);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'posts', originalPostId, 'comments', commentId, 'likes'),
            (snapshot) => {
                setLikes(snapshot.docs);
            });

        return () => unsubscribe();
    }, [db, originalPostId, commentId]);

    const likePost = async () => {
        if (session) {
            if (isLiked) {
                await deleteDoc(doc(db, 'posts', originalPostId, 'comments', commentId, 'likes', session?.user.uid));
            } else {
                await setDoc(doc(db, 'posts', originalPostId, 'comments', commentId, 'likes', session?.user.uid), {
                    username: session.user.username,
                    timestamp: serverTimestamp(),
                });
            }
        } else {
            signIn();
        }
    };
    useEffect(() => {
        onSnapshot(collection(db, 'posts', originalPostId, 'comments', commentId, 'likes'),
            (snapshot) => {
                setLikes(snapshot.docs);
            });
    }, [db, commentId, originalPostId]); // Added commentId and originalPostId


    useEffect(() => {
        setIsLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1);
    }, [likes]); // Added session


    return (
        <div className="flex p-3 border-b border-gray-200 pl-10">
            <img
                src={comment?.userImg}
                alt="user-img"
                className="h-9 w-9 rounded-full mr-4"
            />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="fex items-center space-x-1 whitespace-nowrap">
                        <h4 className="font-bold text-sx truncate">{comment?.name}</h4>
                        <span className="text-xs truncate">@{comment?.username}</span>
                    </div>
                    <HiDotsHorizontal
                        className="text-sm " />
                </div>
                <p className="text-gray-700 text-xs my-3">{comment?.comment}</p>
                <div className="flex items-center">
                    {isLiked ?
                        (
                            <HiHeart
                                onClick={likePost}
                                className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-outp-2  hover:bg-red-100" />
                        ) : (
                            <HiOutlineHeart
                                onClick={likePost}
                                className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-outp-2 hover:text-red-500 hover:bg-red-100" />
                        )}
                    {likes.length > 0 && (
                        <span
                            className={`text-xs ${isLiked && 'text-red-600'}`}>
                            {likes.length}
                        </span>
                    )}

                    {comment?.image && (
                        <img
                            src={comment?.image}
                            alt="comment-image"
                            className="rounded-2xl mr-2"

                        />
                    )}

                    <Icons
                        commentId={commentId}
                        uid={comment.uid}
                    />

                </div>

            </div>
        </div>
    )
}
