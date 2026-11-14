
import { SendIcon, XIcon, SmileIcon, PaperclipIcon, FileTextIcon, DownloadIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react'

const ChatPanel = ({ isOpen, onClose, messages, onSendMessage, currentUser }) => {
    const [text, setText] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const messagesEndRef = useRef(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isOpen])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() || selectedFile) {
            onSendMessage(text, selectedFile);
            setText("")
            setSelectedFile(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    }

    const handleEmojiClick = (emojiData) => {
        setText(prev => prev + emojiData.emoji);
    }

    const removeSelectedFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    if (!isOpen) return null;

    return (
        <aside className='w-full sm:w-80 h-full bg-white border-l border-slate-200 flex flex-col z-30 shadow-2xl animate-in slide-in-from-right duration-200'>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-medium text-slate-900 text-base flex items-center gap-2">In-Meeting Chat</h3>
                <button onClick={onClose}
                    className='p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer'>
                    <XIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                    <div className='h-full flex flex-col items-center justify-center text-center text-slate-400 text-sm'>
                        <p>No messages yet.</p>
                        <p className="text-xs mt-1 text-slate-400">Send a message to start chatting with participants!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === currentUser?.id;
                        return (
                            <div key={msg.id || index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                <div className='flex items-center gap-2 mb-1'>
                                    <span className="text-xs font-semibold text-slate-500">{isMe ? "You" : msg.senderName}</span>
                                    <span className="text-[10px] text-slate-400">{msg.time}</span>
                                </div>
                                <div className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-xs ${isMe
                                    ? "bg-primary text-white rounded-tr-none font-medium"
                                    : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200 font-medium"
                                    }`}>
                                    {msg.text}
                                    {msg.file && (
                                        <div className="mt-2 pt-2 border-t border-slate-200/20">
                                            {msg.file.type?.startsWith('image/') ? (
                                                <img
                                                    src={msg.file.data}
                                                    alt={msg.file.name}
                                                    className="max-w-full max-h-56 object-contain rounded-lg cursor-pointer hover:opacity-90"
                                                    onClick={() => window.open(msg.file.data, '_blank')}
                                                />
                                            ) : (
                                                <div
                                                    className="flex items-center gap-3 min-w-0 max-w-full p-3 bg-white/15 rounded-xl cursor-pointer hover:bg-white/25 transition-colors"
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = msg.file.data;
                                                        link.download = msg.file.name;
                                                        link.click();
                                                    }}
                                                >
                                                    <div className="w-10 h-10 shrink-0 rounded-lg bg-white/20 flex items-center justify-center">
                                                        <FileTextIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold truncate">{msg.file.name}</p>
                                                        <p className="text-[10px] opacity-70 mt-1">Attachment · Download</p>
                                                    </div>
                                                    <DownloadIcon className="w-4 h-4 shrink-0 opacity-80" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Send Form */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 bg-white">
                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div className="mb-2">
                        <EmojiPicker onEmojiClick={handleEmojiClick} height={300} width="100%" />
                    </div>
                )}

                {/* File Preview */}
                {selectedFile && (
                    <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                        {selectedFile.type.startsWith('image/') ? (
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Selected file"
                                className="w-12 h-12 object-cover rounded-lg shrink-0"
                            />
                        ) : (
                            <div className="w-11 h-11 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
                                <FileTextIcon className="w-5 h-5 text-blue-600" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                            <p className="text-[10px] text-slate-500 mt-1">
                                {(selectedFile.size / 1024).toFixed(1)} KB · Ready to send
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={removeSelectedFile}
                            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-1">
                    <input type="text"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 bg-white border border-primary-border/80 focus:border-primary rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs" />

                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all cursor-pointer">
                        <SmileIcon className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all cursor-pointer">
                        <PaperclipIcon className="w-4 h-4" />
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                    />

                    <button
                        type="submit"
                        disabled={!text.trim() && !selectedFile}
                        className="p-2 rounded-lg bg-primary hover:bg-primary-hover text-white disabled:opacity-40 transition-all cursor-pointer shadow-xs">
                        <SendIcon className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </aside>
    )
}

export default ChatPanel
