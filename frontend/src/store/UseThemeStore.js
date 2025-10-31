import {create} from 'zustand';

export const UseThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme: (theme) =>{
        localStorage.setItem("chat-theme", theme);
        set({theme});
    },
}));