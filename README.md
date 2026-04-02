# Real-Time Bitcoin (BTC/USDT) Dashboard

A production-ready React.js application for real-time Bitcoin price monitoring using ByBit WebSocket API with modern UI and advanced features.

## 🚀 Features

### Core Functionality
- **Real-time WebSocket Connection** - Live BTC/USDT price data from ByBit API
- **Auto-reconnection** - Exponential backoff reconnection strategy
- **Connection Status** - Visual indicators for connection health
- **Price Change Animation** - Green/red flash animations for price movements

### Data Display
- **Last Traded Price** - Current Bitcoin price in USD
- **Mark Price** - Fair price calculation
- **24h Statistics** - High, low, volume, and percentage change
- **Sparkline Chart** - Last 60 seconds price visualization
- **TradingView Integration** - Advanced chart widget for BTCUSDT

### User Interface
- **Dark/Light Mode** - Toggle with localStorage persistence
- **Responsive Design** - Mobile-friendly layout
- **Loading Skeletons** - Smooth loading states
- **Modern Fintech Styling** - Professional trading dashboard look

## 🛠️ Tech Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS with custom animations
- **WebSocket**: Native WebSocket API
- **Charts**: TradingView widget integration
- **State Management**: React hooks (useState, useEffect, useRef)
- **Icons**: Inline SVG icons

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard component
│   ├── StatsCard.jsx          # Reusable statistics card
│   ├── ThemeToggle.jsx        # Dark/light mode toggle
│   ├── WebSocketStatus.jsx    # Connection status indicator
│   ├── TradingViewChart.jsx   # TradingView integration
│   └── Sparkline.jsx          # Mini sparkline chart
├── hooks/
│   ├── useWebSocket.js        # Custom WebSocket hook
│   └── useTheme.js            # Theme management hook
├── App.jsx                    # Root component
├── main.jsx                   # App entry point
└── index.css                  # Global styles with Tailwind
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Real-Time-Bitcoin-(BTCUSDT)
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔌 WebSocket Integration

### ByBit API Configuration
- **WebSocket URL**: `wss://stream.bybit.com/v5/public/linear`
- **Subscription**: `tickers.BTCUSDT`
- **Data Points**:
  - Last traded price
  - Mark price
  - 24h high/low
  - 24h turnover (volume)
  - 24h percentage change

### Reconnection Strategy
- **Max Attempts**: 5
- **Initial Delay**: 1 second
- **Max Delay**: 30 seconds
- **Backoff**: Exponential (doubles each attempt)

## 🎨 Customization

### Theme Customization
Edit `src/index.css` to modify color schemes:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... other variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... other variables */
}
```

### Adding New Statistics
1. Update the WebSocket data parsing in `useWebSocket.js`
2. Add new `StatsCard` components in `Dashboard.jsx`
3. Extend the `formatValue` function in `StatsCard.jsx`

### TradingView Customization
Modify `TradingViewChart.jsx` to change:
- Chart intervals
- Display symbols
- Chart themes
- Additional features

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- ESLint configuration for React best practices
- Modular component architecture
- Custom hooks for reusable logic
- Error boundaries and loading states

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- WebSocket support required

## 📊 Performance Features

- **Optimized Re-renders**: Efficient React state management
- **WebSocket Throttling**: Connection management
- **Lazy Loading**: Chart components load on demand
- **CSS Animations**: Hardware-accelerated transitions

## 🔒 Security Considerations

- **CORS Handling**: ByBit API CORS-compliant
- **Input Validation**: WebSocket message parsing
- **Error Boundaries**: Graceful error handling
- **No API Keys**: Public WebSocket endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [ByBit](https://bybit.com/) - Real-time cryptocurrency data
- [TradingView](https://tradingview.com/) - Chart widget integration
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Build tool and development server

---

**Note**: This application uses public APIs and doesn't require authentication. Real-time data is provided for informational purposes only and should not be used for actual trading decisions.
