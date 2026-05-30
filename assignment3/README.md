# AI-Driven Quiz Platform - Mobile App (React Native)

This is the mobile client for the AI-Driven Quiz Platform developed by Clayton Ma for IFN666. It is built with **React Native**, **Expo**, and **React Native Elements**. The platform provides user authentication, group management, quiz creation and editing, and AI-powered question generation using Gemini.

## Purpose

The purpose of this mobile app is to provide a responsive, intuitive, and secure mobile interface that interfaces with the backend API. It handles the user experience for digitizing assessments, managing group hierarchies, and facilitating interaction with Large Language Models (LLMs) to automate the creation of educational content on the go.

## Architecture

The application follows a standard client-server architecture using a feature-based folder structure:

- **`src/app`**: Contains application-level configuration, routing (`navigation/`), and global providers (`AuthContext`, `ThemeContext`).
- **`src/assets`**: Static assets such as images, fonts, and icons.
- **`src/components`**: Reusable UI components (e.g., layouts, buttons, dialogs, and notifications).
- **`src/features`**: Core business logic modules (`about`, `attempt`, `auth`, `group`, `quiz`, `user`). Each feature contains its own:
  - `components`: Feature-specific UI components.
  - `screens`: Routed screens for the feature.
  - `services`: Feature-specific API service calls.
- **`src/services`**: Shared global services like API endpoints and authentication headers.
- **`src/utils`**: Helper functions and shared utilities.

## Dependencies

Key dependencies used in this assignment:

- `@expo/ngrok`: `^4.1.3`
- `@expo/vector-icons`: `^15.1.1`
- `@react-native-picker/picker`: `^2.11.4`
- `@react-navigation/bottom-tabs`: `^7.15.11`
- `@react-navigation/native`: `^7.2.2`
- `@react-navigation/stack`: `^7.8.11`
- `expo`: `~54.0.33`
- `expo-blur`: `^56.0.3`
- `expo-constants`: `~18.0.13`
- `expo-device`: `~8.0.10`
- `expo-linking`: `~8.0.12`
- `expo-notifications`: `~0.32.17`
- `expo-print`: `~15.0.8`
- `expo-secure-store`: `^55.0.13`
- `expo-sensors`: `~15.0.8`
- `expo-sharing`: `~14.0.8`
- `expo-splash-screen`: `~31.0.13`
- `expo-status-bar`: `~3.0.9`
- `react`: `19.1.0`
- `react-hook-form`: `^7.76.0`
- `react-native`: `0.81.5`
- `react-native-elements`: `^3.4.3`
- `react-native-gesture-handler`: `^2.31.2`
- `react-native-safe-area-context`: `~5.6.0`
- `react-native-screens`: `~4.16.0`
- `react-native-vector-icons`: `^10.3.0`

## Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd AI-Quiz-Platform-Mobile/assignment3
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the `assignment3` root directory and add the following:

    ```env
    EXPO_PUBLIC_API_BASE_URL=<<your_api_base_url>>
    ```

4.  **Run the application**
    Ensure your backend server is running, then start the Expo Go bundler:

    ```bash
    npx expo start
    ```

## How to Contribute

To maintain high code quality, please adhere to the following guidelines:

1.  **JSDoc**: All services, hooks, and utility functions must be documented using JSDoc syntax.
2.  **Error Handling**: Utilize the notification components in `src/components/ui/` (such as `ShowErrorNotification` and `ShowNotification`) to handle and display errors or success messages returned from the backend.
3.  **Branching**: Submit all changes via Pull Request from a `feature/feature-name` or `bugfix/issue-name` branch.

## Issue Reporting

Please use the GitHub Issue Tracker to report bugs. To ensure a fast resolution, please include:

- **Context**: A brief description of the issue.
- **Endpoint**: The affected API endpoint (if applicable).
- **Payload**: The request body or data used during the action.
- **Logs**: The specific error message or status code received.

## License

This project is developed for educational purposes as part of the IFN666 unit at QUT. All rights reserved.

## Contact

Clayton Ma - [GitHub Profile](https://github.com/clayton-ma)
