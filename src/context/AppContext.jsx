import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  setDoc, 
  getDoc,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

// In-memory defaults (for seeding)
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
  const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem('pb_loggedUserId'));
  const [loading, setLoading] = useState(true);

  const currentUser = users.find(u => u.id === currentUserId) || null;

  // Real-time listeners
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      
      // If db is empty, seed it
      if (snapshot.empty) {
        seedInitialData();
      }
    });

    const unsubCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const catsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(catsData);
    });

    const unsubTxs = onSnapshot(query(collection(db, 'transactions'), orderBy('date', 'desc')), (snapshot) => {
      const txsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(txsData);
      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubCats();
      unsubTxs();
    };
  }, []);

  const seedInitialData = async () => {
    console.log('Seeding initial data to Firestore...');
    // Seed users
    for (const user of DEFAULT_USERS) {
      const { id, ...userData } = user;
      await setDoc(doc(db, 'users', id), userData);
    }
    // Seed categories
    for (const cat of DEFAULT_CATEGORIES) {
      const { id, ...catData } = cat;
      await setDoc(doc(db, 'categories', id), catData);
    }
  };

  const login = async (username, password) => {
    const q = query(collection(db, 'users'), where('username', '==', username), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      setCurrentUserId(userId);
      localStorage.setItem('pb_loggedUserId', userId);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUserId(null);
    localStorage.removeItem('pb_loggedUserId');
  };

  const register = async (userData) => {
    const q = query(collection(db, 'users'), where('username', '==', userData.username));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return false; // username already exists
    }

    const newUser = {
      ...userData,
      role: 'nasabah',
      balance: 0,
      totalWeight: 0,
      createdAt: new Date().toISOString()
    };
    
    await addDoc(collection(db, 'users'), newUser);
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
    
    await addDoc(collection(db, 'transactions'), newTx);

    // Update user balance in Firestore
    const userRef = doc(db, 'users', targetUserId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      await updateDoc(userRef, {
        balance: (userData.balance || 0) + amount,
        totalWeight: (userData.totalWeight || 0) + (weight || 0)
      });
    }
  };

  const updateCategoryPrice = async (categoryId, newPrice) => {
    const catRef = doc(db, 'categories', categoryId);
    await updateDoc(catRef, {
      pricePerKg: Number(newPrice)
    });
  };

  const updateUserRole = async (userId, newRole) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: newRole
    });
  };

  const getSystemStats = () => {
    const totalBalance = users.reduce((acc, user) => acc + (user.balance || 0), 0);
    const totalWeight = users.reduce((acc, user) => acc + (user.totalWeight || 0), 0);
    return { totalBalance, totalWeight };
  };

  return (
    <AppContext.Provider value={{ 
      users, 
      currentUser, 
      categories, 
      transactions, 
      loading,
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

