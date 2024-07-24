"use client"

import {
    HiOutlineChat,
    HiOutlineHeart,
    HiOutlineTrash,
    HiHeart
}
    from "react-icons/hi"

import {
    signIn,
    useSession
}
    from 'next-auth/react';

import {
    getFirestore,
    serverTimestamp,
    doc,
    setDoc,
    onSnapshot,
    collection,
    deleteDoc,
}
    from "firebase/firestore";

import { app } from '../firebase';

import {
    useEffect,
    useState
}
    from "react";
import { modalState, postIdState } from "@/atom/modalAtom";
import { useRecoilState } from 'recoil';


export default function Icons({ id, uid }) {
    const { data: session } = useSession();
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const [open, setOpen] = useRecoilState(modalState);
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useRecoilState(postIdState);
    const db = getFirestore(app);
    const likePost = async () => {
        if (session) {
            if (isLiked) {
                await deleteDoc(doc(db, 'posts', id, 'likes', session?.user.uid));
            } else {
                await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
                    username: session.user.username,
                    timestamp: serverTimestamp(),
                });
            }
        } else {
            signIn();
        }
    };

    useEffect(
        () => {
            onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) => {
                setLikes(snapshot.docs);
            });
        }, [db]);

    useEffect(() => {
        setIsLiked(likes.findIndex((like) => like.id === session?.user?.uid)
            !== -1);
    }, [likes]);

    const deletePost = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            if (session?.user?.uid === uid) {
                deleteDoc(doc(db, 'posts', id)).then(() => {
                    console.log('Document succesfully deleted');
                    window.Location.reload();
                }).catch((error) => {
                    console.error('Error removing document: ', error);
                });
            } else {
                alert('You are not authorized to delete this post!');
            }
        }
    };
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'posts', id, 'comments'),
            (snapshot) => {
                setComments(snapshot.docs)
            });
        return () => unsubscribe();
    }, [db, id]);

    return (
        <div className="flex justify-between  p-2 text-gray-300">
            <div className="flex items-center hover:text-sky-500">
                <HiOutlineChat
                    className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-outp-2  hover:bg-sky-100"
                    onClick={() => {
                        if (!session) {
                            signIn()
                        } else {
                            setOpen(!open);
                            setPostId(id);
                        }
                    }}
                />
                {
                    comments.length > 0 && (
                        <span className="text-xs ">
                            {comments.length}
                        </span>
                    )
                }
            </div>
            <div className="flex items-center hover:text-red-500">
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
                {likes.length > 0 && <span className={`text-xs ${isLiked && 'text-red-600'}`}>{likes.length}</span>}
            </div>
            {session?.user?.uid === uid && (
                <HiOutlineTrash
                    onClick={deletePost}
                    className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-outp-2 hover:text-red-500 hover:bg-red-100" />
            )}



        </div>
    )
}

