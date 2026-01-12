import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
    return (_jsx(Router, { children: _jsx(Routes, { children: _jsx(Route, { path: "/", element: _jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("h1", { className: "text-4xl font-bold", children: "TaskFlow - Coming Soon" }) }) }) }) }));
}
export default App;
