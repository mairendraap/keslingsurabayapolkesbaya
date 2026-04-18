import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const DEFAULT_CATEGORIES = [
  { id: 'organik', name: 'Organik', pricePerKg: 1000 },
  { id: 'anorganik', name: 'Anorganik', pricePerKg: 2000 },
  { id: 'elektronik', name: 'Elektronik', pricePerKg: 3500 },
  { id: 'b3', name: 'B3 (Berbahaya)', pricePerKg: 500 },
  { id: 'lain-lain', name: 'Lain-lain', pricePerKg: 1500 },
];

const DEFAULT_USERS = [
  { id: 'u1', username: 'admin', password: '123', name: 'Administrator', role: 'admin', balance: 0, totalWeight: 0 },
  { id: 'u2', username: 'petugas', password: '123', name: 'Petugas Bank', role: 'petugas', balance: 0, totalWeight: 0 },
  { id: 'u3', username: 'anya', password: '123', name: 'Anya', role: 'nasabah', balance: 50000, totalWeight: 5.5 },
];

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem('loggedUserId'));
  const currentUser = users.find(u => u.id === currentUserId) || null;

  // Initialize DB if empty
  useEffect(() => {
    const initDb = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      if (usersSnap.empty) {
        DEFAULT_USERS.forEach(async (u) => {
          await setDoc(doc(db, "users", u.id), u);
        });
      }
      const catSnap = await getDocs(collection(db, "categories"));
      if (catSnap.empty) {
        DEFAULT_CATEGORIES.forEach(async (c) => {
          await setDoc(doc(db, "categories", c.id), c);
        });
      }
    };
    initDb();
  }, []);

  // Sync real-time
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), snapshot => {
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubCategories = onSnapshot(collection(db, "categories"), snapshot => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubTransactions = onSnapshot(collection(db, "transactions"), snapshot => {
      const txs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setTransactions(txs.sort((a,b) => new Date(b.date) - new Date(a.date)));
    });

    return () => {
      unsubUsers();
      unsubCategories();
      unsubTransactions();
    };
  }, []);

  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUserId(user.id);
      localStorage.setItem('loggedUserId', user.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUserId(null);
    localStorage.removeItem('loggedUserId');
  };

  const register = async (userData) => {
    if (users.find(u => u.username === userData.username)) {
      return false; // username already exists
    }
    const newId = 'u' + Date.now();
    const newUser = {
      ...userData,
      role: 'nasabah',
      balance: 0,
      totalWeight: 0
    };
    await setDoc(doc(db, "users", newId), newUser);
    return true;
  };

  const addTransaction = async (targetUserId, type, details, weight, amount) => {
    const newTx = {
      userId: targetUserId,
      type, // 'setor' | 'tarik'
      details, 
      weight: weight || 0,
      amount, 
      date: new Date().toISOString()
    };
    
    // Add transaction document
    await addDoc(collection(db, "transactions"), newTx);

    // Update user balance
    const targetUser = users.find(u => u.id === targetUserId);
    if (targetUser) {
      const userRef = doc(db, "users", targetUserId);
      await updateDoc(userRef, {
        balance: targetUser.balance + amount,
        totalWeight: targetUser.totalWeight + (weight || 0)
      });
    }
  };

  const updateCategoryPrice = async (categoryId, newPrice) => {
    const catRef = doc(db, "categories", categoryId);
    await updateDoc(catRef, { pricePerKg: Number(newPrice) });
  };

  const updateUserRole = async (userId, newRole) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role: newRole });
  };

  const getSystemStats = () => {
    const totalBalance = users.reduce((acc, user) => acc + user.balance, 0);
    const totalWeight = users.reduce((acc, user) => acc + user.totalWeight, 0);
    return { totalBalance, totalWeight };
  };

  return (
    <AppContext.Provider value={{ 
      users, 
      currentUser, 
      categories, 
      transactions, 
      login, 
      logout,
      register,
      addTransaction,
      updateCategoryPrice,
      updateUserRole,
      getSystemStats
    }}>
      {children}
    </AppContext.Provider>
  );
};
