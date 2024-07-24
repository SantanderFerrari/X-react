"use client";

import { useRecoilState } from 'recoil';
import Modal from 'react-modal';
import { HiX } from 'react-icons/hi';
import { modalState, postIdState } from '@/atom/modalAtom';
import { useEffect, useState } from 'react';
import { addDoc, collection, doc, getFirestore, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { app } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function CommentModal() {
    const [open, setOpen] = useRecoilState(modalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const [input, setInput] = useState('');
    const [post, setPost] = useState({});
    const { data: session } = useSession();
    const db = getFirestore(app);
    const router = useRouter();

    useEffect(() => {
        if (postId) {
            const postRef = doc(db, 'posts', postId);
            const unsubscribe = onSnapshot(postRef, (snapshot) => {
                if (snapshot.exists()) {
                    setPost(snapshot.data());
                } else {
                    console.log('No such document!');
                }
            });
            return () => unsubscribe();
        }
    }, [postId, db]);

    const sendComment = async () => {
        try {
            await addDoc(collection(db, 'posts', postId, 'comments'), {
                name: session.user.name,
                username: session.user.username,
                userImg: session.user.image,
                comment: input,
                timestamp: serverTimestamp(),
            });
            setInput('');
            setOpen(false);
            router.push(`/posts/${postId}`);
        } catch (error) {
            console.log('Error adding document:', error);
        }
    };

    return (
        <div>
            {open && (
                <Modal
                    isOpen={open}
                    onRequestClose={() => setOpen(false)}
                    ariaHideApp={false}
                    className="max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-4 border-slate-500 rounded-xl shadow-lg"
                >
                    <div className='p-4'>
                        <div className='border-b border-gray-200 py-2 px-1.5'>
                            <HiX className="text-2xl text-gray-600 p-1 hover:bg-gray-200 rounded-full cursor-pointer"
                                onClick={() => setOpen(false)}
                            />
                        </div>
                        <div className='p-2 flex items-center space-x-1 relative'>
                            <span className='w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300' />
                            <Image
                                src={post?.profileImg}
                                alt='post-profile-img'
                                className='h-11 w-11 rounded-full mr-4'
                                width={44}
                                height={44}
                            />
                            <div>
                                <h4 className='font-bold sm:text-[16px] text-[15px] hover:underline truncate'>
                                    {post?.name}
                                </h4>
                                <span className='text-sm sm:text-[15px] truncate'>
                                    @{post?.username}
                                </span>
                            </div>
                        </div>
                        <p className='text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2'>
                            {post?.text}
                        </p>
                        <div className='flex p-3 space-x-3'>
                            <Image
                                src={session.user.image}
                                alt='user-img'
                                className='h-11 w-11 rounded-full cursor-pointer hover:brightness-90'
                                width={44}
                                height={44}
                            />
                            <div className='w-full divide-y divide-gray-400'>
                                <textarea
                                    className='w-full border-none outline-none tracking-wide min-h-[40px] text-gray-600 placeholder:text-gray-500'
                                    placeholder='Post your reply...'
                                    rows='2'
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='flex items-center justify-end pt-2.5'>
                            <button
                                className='bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50'
                                disabled={input.trim() === ''}
                                onClick={sendComment}
                            >
                                Reply
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
