# WhisperLink

WhisperLink is an anonymous chat application designed with a strong emphasis on privacy and security. It enables users to engage in conversations without the need for traditional login methods, ensuring anonymity by not requiring personal information such as email addresses or phone numbers. The app prioritizes user privacy through end-to-end encryption, employs a hybrid encryption model, utilizes security questions for verification when joining chats, and automatically deletes chats after 24 hours. WhisperLink also supports file and image sharing functionalities.

## Features

- **Anonymous Chatting**: Users can engage in conversations without the need for personal information.
- **End-to-End Encryption**: Messages are encrypted from the sender's device and only decrypted on the recipient's device, ensuring secure communication.
- **Hybrid Encryption Model**: Utilizes a combination of symmetric and asymmetric encryption techniques for enhanced security.
- **Security Questions**: Users are required to answer security questions when joining chats to further ensure privacy.
- **Chat Deletion**: Chats are automatically deleted after 24 hours to minimize data retention.
- **File and Image Sharing**: Users can share files and images securely within the app.

## Tech Stack

WhisperLink is built using the following technologies:

- React: JavaScript library for building user interfaces.
- Firebase: Backend-as-a-Service platform for building web and mobile applications.

## How to Use

1. Accessing the App: Visit the [WhisperLink website](whisperlink.web.app)
![Home_Page](https://github.com/Ajambot/WhisperLink/assets/50452065/24f301c5-4ec0-44a7-bb9b-32bd9ea11eda)

2. Starting a Chat: Upon opening the app, you will be presented with the option to start a new chat or join an existing one. Click on "Create Chatroom" to initiate a new conversation.
![Create_Chat](https://github.com/Ajambot/WhisperLink/assets/50452065/222b00cc-4e45-4f5b-8d77-b273cce4229a)

3. Joining a Chat: If you wish to join an existing chat, you will be prompted to answer security questions to verify your identity. Once verified, you can enter the chat room and start participating in the conversation.

4. Invite friends: Share the invite link or chat ID to people you want to chat with so they can join the conversation.
![link_chat](https://github.com/Ajambot/WhisperLink/assets/50452065/1c7ed903-ba43-4cc1-b60a-994567de9c8c)

5. Sending Messages: To send a message, simply type your text into the message input field and press "Send". Your message will be encrypted and securely delivered to the recipient.
![Chat_image](https://github.com/Ajambot/WhisperLink/assets/50452065/557144d3-ad1c-4cb9-bbc9-6aae02c1f53b)

6. Sharing Files and Images: To share a file or image, click on the respective attachment icon within the chat window. Choose the file or image you wish to share from your device, and it will be securely transmitted to the recipient with your next message.

7. Managing Chats: Users can create and join multiple chats. Chats are automatically deleted after 24 hours to ensure privacy and data security.

## Contributing

### Setup

1. Fork and clone the repository
2. run `npm i`
3. Create your own Firebase project and replace the config info to test your changes
4. Install the [Firebase emulators](https://firebase.google.com/docs/emulator-suite/install_and_configure)
5. run `npm run emulators` to test your changes
4. Open a pull request

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
