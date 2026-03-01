# Coin Watch - Solana Wallet Tracker

A comprehensive web application for tracking and analyzing Solana wallet performance, PnL (Profit and Loss), token holdings, and trading history. Built with modern React and TypeScript, Coin Watch provides real-time insights into Solana wallet activities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Available Scripts](#available-scripts)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- **Wallet Tracking**: Add and monitor multiple Solana wallets
- **PnL Analysis**: Track realized and unrealized profit/loss for each wallet
- **Portfolio Overview**: View comprehensive portfolio breakdowns with token holdings
- **Trade History**: Detailed transaction history with buy/sell information
- **Token Information**: Get detailed information about any Solana token
- **Token Snapshots**: View token holder distributions and snapshots
- **Real-time Updates**: Live data fetching from Solana blockchain

### User Interface
- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **Dark Mode**: Full dark/light theme support with smooth transitions
- **Responsive Design**: Optimized for desktop and mobile devices
- **Smooth Animations**: Framer Motion powered animations
- **Search Functionality**: Quick search across tracked wallets
- **Preloader**: Elegant loading experience on app initialization

### Pages
- **Dashboard**: Overview of all tracked wallets with quick stats
- **Wallet Details**: Comprehensive view of individual wallet performance
- **Portfolio**: Detailed portfolio breakdown with token values
- **PnL Checker**: Profit and loss analysis tool
- **Token Info**: Detailed token information and statistics
- **Token Snapshot**: Token holder distribution analysis

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool and dev server
- **React Router DOM 6.30.1** - Client-side routing
- **TanStack Query 5.83.0** - Data fetching and caching
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 12.34.2** - Animation library
- **Radix UI** - Accessible component primitives
  - Dialog, Separator, Slot, Toast, Toggle, Tooltip
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **next-themes** - Theme management

### Backend
- **Express 5.2.1** - Web framework
- **TypeScript** - Type safety
- **Solana Tracker** - Blockchain data provider
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Testing framework
- **Testing Library** - React component testing
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** or **pnpm** package manager
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "solana wallet tracker/frontend"
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   SOLANA_TRACKER_APIKEY=
   ```

## ⚙️ Configuration

### Frontend Configuration

The frontend uses Vite for building. Key configuration files:

- `vite.config.ts` - Vite configuration with path aliases
- `tailwind.config.ts` - Tailwind CSS customization
- `tsconfig.json` - TypeScript configuration
- `components.json` - UI component configuration

### Backend Configuration

The backend API base URL is configured in `src/lib/utils.ts`:
```typescript
const API_BASE_URL = "";
```

For local development, update this to:
```typescript
const API_BASE_URL = "http://localhost:5000/api/wallet";
```

## 🏃 Running the Project

### Development Mode

1. **Start the backend server** (in one terminal)
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server** (in another terminal)
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:8080`

3. **Open your browser**
   Navigate to `http://localhost:8080` to view the application

### Production Mode

1. **Build the backend**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build the frontend**
   ```bash
   npm run build
   ```

3. **Preview the production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
frontend/
├── backend/                 # Backend Express server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic services
│   │   └── server.ts       # Express server entry point
│   ├── dist/               # Compiled JavaScript (generated)
│   └── package.json
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── Navbar.tsx     # Navigation component
│   │   ├── Preloader.tsx  # Loading component
│   │   └── ThemeToggle.tsx # Theme switcher
│   ├── context/           # React context providers
│   │   └── DataContext.tsx # Global data context
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   │   └── utils.ts       # API functions and types
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx
│   │   ├── WalletDetails.tsx
│   │   ├── Portfolio.tsx
│   │   ├── PnlChecker.tsx
│   │   ├── TokenInfo.tsx
│   │   ├── TokenSnapshot.tsx
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Frontend dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔌 API Endpoints

The application communicates with the backend API at `/api/wallet`. Available endpoints:

### Wallet Management
- `GET /walletLists` - Fetch all tracked wallets
- `GET /walletdetails?address={address}` - Get detailed wallet information
- `GET /pnl?address={address}` - Get wallet PnL data
- `GET /portfolio?address={address}` - Get wallet portfolio
- `POST /addwallet?walletaddress={address}&walletname={name}&avatar={avatar}` - Add new wallet

### Token Information
- `GET /tokendetails?tokenaddress={address}` - Get token details
- `GET /snapshots?tokenaddress={address}` - Get token snapshot

### Response Types

#### Wallet List Response
```typescript
interface fetchWalletResponse {
  walletaddress: string;
  walletname: string;
  totalinvested: number;
  positive: boolean;
  avatar: string;
  totalpnl: number;
  realizedpnl: number;
  unrealizedpnl: number;
}
```

#### Wallet PnL Response
```typescript
interface WalletPNL {
  walletaddress: string;
  totalinvested: string;
  totalpnl: string;
  pnlpositive: boolean;
  realizedpnl: string;
  unrealizedpnl: string;
  totalwins: number;
  totallosses: number;
  averagebuyamount: string;
  winpercentage: string;
  losspercentage: string;
  neutralizedpercentage: string;
  portfoliopercentagechange: string;
  porfoliopnlusdvalue: number;
}
```

## 📜 Available Scripts

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

### Backend Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

## 💻 Development

### Adding a New Wallet

1. Navigate to the Dashboard page
2. Click "Add Wallet" button
3. Enter the Solana wallet address
4. Optionally provide a wallet name
5. Click "Add" to save

### Customizing Themes

The application supports dark and light themes. Theme configuration is in `tailwind.config.ts` using CSS variables. Customize colors by modifying the HSL values in `src/index.css`.

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add a route in `src/App.tsx`:
   ```typescript
   <Route path="/your-path" element={<YourComponent />} />
   ```
3. Add navigation link in `src/components/Navbar.tsx` if needed

### API Integration

All API calls are centralized in `src/lib/utils.ts`. To add a new endpoint:

1. Create a new function in `utils.ts`
2. Define TypeScript interfaces for request/response
3. Use the function in your components with React Query

Example:
```typescript
export const fetchNewData = async (param: string): Promise<DataType> => {
  const response = await fetch(`${API_BASE_URL}/endpoint?param=${param}`);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};
```

## 🏗 Building for Production

1. **Build the frontend**
   ```bash
   npm run build
   ```
   Output will be in the `dist/` directory

2. **Build the backend**
   ```bash
   cd backend
   npm run build
   ```
   Compiled JavaScript will be in `backend/dist/`

3. **Deploy**
   - Frontend: Deploy the `dist/` folder to a static hosting service (Vercel, Netlify, etc.)
   - Backend: Deploy the `backend/dist/` folder to a Node.js hosting service (Render, Railway, etc.)

## 🧪 Testing

Run tests with:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Add comments for complex logic
- Follow the existing code structure

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Solana Tracker** - For providing Solana blockchain data APIs
- **Radix UI** - For accessible component primitives
- **Vite** - For the excellent build tooling
- **React Team** - For the amazing React library

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Built with ❤️ by Nova Dev**

