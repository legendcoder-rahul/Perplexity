import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId } = req.body;

        // Validate message
        if (!message || message.trim() === '') {
            return res.status(400).json({
                message: 'Message content is required',
                success: false
            })
        }

        let title = null, chat = null;

        if (!chatId) {
            console.log('🔄 Generating chat title...')
            try {
                title = await generateChatTitle(message);
                console.log('✅ Title:', title)
            } catch (err) {
                console.error('❌ Title error:', err.message)
                title = message.substring(0, 50)
            }
            console.log('💾 Creating chat...')
            chat = await chatModel.create({
                user: req.user.id,
                title
            })
        } else {
            chat = await chatModel.findOne({
                _id: chatId,
                user: req.user.id
            })
            if (!chat) {
                return res.status(404).json({
                    message: 'Chat not found',
                    success: false
                })
            }
        }

        const userMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: message,
            role: "user"
        })

        const messages = await messageModel.find({ chat: chatId || chat._id })

        const result = await generateResponse(messages);

        const aiMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: result,
            role: "ai"
        })
     

        res.status(201).json({
            title,
            chat,
            aiMessage,
            success: true
        })
    } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({
            message: 'Failed to send message',
            success: false,
            error: error.message
        })
    }

}

export async function getChats(req, res) {
    try {
        const user = req.user

        const chats = await chatModel.find({ user: user.id })

        res.status(200).json({
            message: "Chats retrieved successfully",
            chats,
            success: true
        })
    } catch (error) {
        console.error('Error in getChats:', error);
        res.status(500).json({
            message: 'Failed to retrieve chats',
            success: false,
            error: error.message
        })
    }
}

export async function getMessages(req, res) {
    try {
        const { chatId } = req.params

        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        })

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
                success: false
            })
        }

        const messages = await messageModel.find({ chat: chatId })

        res.status(200).json({
            message: "Messages received successfully",
            messages,
            success: true
        })
    } catch (error) {
        console.error('Error in getMessages:', error);
        res.status(500).json({
            message: 'Failed to retrieve messages',
            success: false,
            error: error.message
        })
    }
}

export async function deleteChat(req, res) {
    try {
        const { chatId } = req.params
        console.log('🗑️ Attempting to delete chat:', chatId)
        
        // First, verify the chat exists and belongs to the user
        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        })

        if (!chat) {
            console.warn('⚠️ Chat not found:', chatId)
            return res.status(404).json({
                message: "Chat not found",
                success: false
            })
        }

        // Now delete the chat
        console.log('💾 Deleting chat from database...')
        await chatModel.findOneAndDelete({
            _id: chatId,
            user: req.user.id
        })

        // Delete all associated messages
        console.log('💾 Deleting associated messages...')
        await messageModel.deleteMany({
            chat: chatId
        })

        console.log('✅ Chat deleted successfully')
        res.status(200).json({
            message: "Chat deleted successfully",
            success: true
        })
    } catch (error) {
        console.error('❌ Error deleting chat:', error)
        res.status(500).json({
            message: 'Failed to delete chat',
            success: false,
            error: error.message
        })
    }
}