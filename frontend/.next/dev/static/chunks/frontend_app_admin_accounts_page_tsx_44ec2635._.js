(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/app/admin/accounts/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminAccountsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/styled-components/dist/styled-components.browser.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function AdminAccountsPage() {
    _s();
    // Added <any[]> to satisfy TypeScript and prevent the 'never' error in VS Code
    const [admins, setAdmins] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const itemsPerPage = 20;
    const fetchData = async ()=>{
        setLoading(true);
        try {
            const [adminRes, userRes] = await Promise.all([
                fetch('http://localhost:5001/api/auth/admins', {
                    credentials: 'include'
                }),
                fetch('http://localhost:5001/api/users', {
                    credentials: 'include'
                })
            ]);
            const adminData = await adminRes.json();
            const userData = await userRes.json();
            // Added Array checks to prevent the ".filter is not a function" error
            setAdmins(Array.isArray(adminData) ? adminData : []);
            setUsers(Array.isArray(userData) ? userData : []);
        } catch (err) {
            console.error("Fetch error:", err);
            setAdmins([]);
            setUsers([]);
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminAccountsPage.useEffect": ()=>{
            fetchData();
        }
    }["AdminAccountsPage.useEffect"], []);
    const filteredUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminAccountsPage.useMemo[filteredUsers]": ()=>{
            // Safety guard to ensure users is always an array
            const safeUsers = Array.isArray(users) ? users : [];
            return safeUsers.filter({
                "AdminAccountsPage.useMemo[filteredUsers]": (user)=>`${user?.name || ''} ${user?.surname || ''} ${user?.email || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
            }["AdminAccountsPage.useMemo[filteredUsers]"]);
        }
    }["AdminAccountsPage.useMemo[filteredUsers]"], [
        users,
        searchQuery
    ]);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const currentData = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const handleUserDelete = async (id)=>{
        if (!confirm('PERMANENT ACTION: This will delete the user and their login. Continue?')) return;
        try {
            const res = await fetch(`http://localhost:5001/api/users/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                setUsers(users.filter((u)=>u.id !== id));
            }
        } catch (err) {
            alert('An error occurred');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PageLayout, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "mb-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                            children: "System Administrators"
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AdminGrid, {
                            children: admins.map((admin)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AdminCard, {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "dot"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                            lineNumber: 82,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: admin.email
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                            lineNumber: 83,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "role-tag",
                                            children: "Full Access"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                            lineNumber: 84,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, admin.id, true, {
                                    fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                    style: {
                        border: 'none',
                        borderTop: '1px solid #e2e8f0',
                        marginBottom: '3rem'
                    }
                }, void 0, false, {
                    fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeaderControls, {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                                            children: "User Profiles"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                            lineNumber: 96,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PageSelector, {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    children: "Jump to:"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                                    lineNumber: 98,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: currentPage,
                                                    onChange: (e)=>setCurrentPage(Number(e.target.value)),
                                                    disabled: totalPages <= 1,
                                                    children: Array.from({
                                                        length: totalPages || 1
                                                    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: i + 1,
                                                            children: [
                                                                "Page ",
                                                                i + 1
                                                            ]
                                                        }, i + 1, true, {
                                                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                                            lineNumber: 105,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                                    lineNumber: 99,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                            lineNumber: 97,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SearchInput, {
                                    placeholder: "Search members...",
                                    value: searchQuery,
                                    onChange: (e)=>{
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserGrid, {
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Loading member data..."
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                lineNumber: 123,
                                columnNumber: 15
                            }, this) : currentData.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyState, {
                                children: "No members found."
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                lineNumber: 125,
                                columnNumber: 15
                            }, this) : currentData.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserCard, {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "left",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                    children: user.logo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: user.logo,
                                                        alt: ""
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                                        lineNumber: 130,
                                                        columnNumber: 42
                                                    }, this) : user.name?.[0]
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                                    lineNumber: 130,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "info",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: [
                                                                user.name,
                                                                " ",
                                                                user.surname
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                                            lineNumber: 132,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            children: user.email
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                                            lineNumber: 133,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                            lineNumber: 129,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DeleteBtn, {
                                            onClick: ()=>handleUserDelete(user.id),
                                            children: "Delete User"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                            lineNumber: 136,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, user.id, true, {
                                    fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                    lineNumber: 128,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StickyPagination, {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "inner",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                disabled: currentPage === 1,
                                onClick: ()=>setCurrentPage((p)=>p - 1),
                                children: "← Previous"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                lineNumber: 148,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "page-info",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: [
                                            "Page ",
                                            currentPage,
                                            " of ",
                                            totalPages || 1
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        children: [
                                            filteredUsers.length,
                                            " total members"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                lineNumber: 154,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                disabled: currentPage === totalPages || totalPages === 0,
                                onClick: ()=>setCurrentPage((p)=>p + 1),
                                children: "Next →"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/frontend/app/admin/accounts/page.tsx",
                    lineNumber: 146,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/app/admin/accounts/page.tsx",
            lineNumber: 74,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/admin/accounts/page.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(AdminAccountsPage, "s0KTegBt1XFwdWlMYkj5Mt1JNSQ=");
_c = AdminAccountsPage;
/* ---------------- STYLES (Unchanged) ---------------- */ const PageLayout = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` padding: 2.5rem; background-color: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; `;
_c1 = PageLayout;
const SectionTitle = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].h2` font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 1.5rem; letter-spacing: -0.025em; `;
_c2 = SectionTitle;
const AdminGrid = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; `;
_c3 = AdminGrid;
const AdminCard = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` background: white; padding: 1rem 1.25rem; border-radius: 10px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: #334155; .dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; } .role-tag { margin-left: auto; font-size: 0.7rem; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-weight: 600; } `;
_c4 = AdminCard;
const HeaderControls = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1.5rem; .left { display: flex; align-items: baseline; gap: 2rem; } `;
_c5 = HeaderControls;
const PageSelector = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` display: flex; align-items: center; gap: 0.5rem; label { font-size: 0.85rem; font-weight: 600; color: #64748b; } select { padding: 0.4rem 0.8rem; border-radius: 6px; border: 1px solid #cbd5e1; background: white; cursor: pointer; } `;
_c6 = PageSelector;
const SearchInput = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].input` flex: 1; max-width: 400px; padding: 0.75rem 1.25rem; border-radius: 10px; border: 1px solid #cbd5e1; &:focus { outline: 2px solid #3b82f6; } `;
_c7 = SearchInput;
const UserGrid = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; `;
_c8 = UserGrid;
const UserCard = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` background: white; padding: 1.25rem; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; .left { display: flex; align-items: center; gap: 1.25rem; } .info { display: flex; flex-direction: column; strong { color: #0f172a; } small { color: #64748b; } } `;
_c9 = UserCard;
const Avatar = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` width: 48px; height: 48px; border-radius: 50%; background: #facc15; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; overflow: hidden; img { width: 100%; height: 100%; object-fit: cover; } `;
_c10 = Avatar;
const DeleteBtn = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].button` background: #fff1f2; color: #e11d48; padding: 0.6rem 1.2rem; border-radius: 8px; border: 1px solid #ffe4e6; font-weight: 700; cursor: pointer; `;
_c11 = DeleteBtn;
const EmptyState = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` text-align: center; padding: 4rem; color: #94a3b8; `;
_c12 = EmptyState;
const StickyPagination = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` position: sticky; bottom: 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 0.75rem 1.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); margin-top: 2rem; z-index: 10; .inner { display: flex; justify-content: space-between; align-items: center; } .page-info { display: flex; flex-direction: column; align-items: center; b { color: #0f172a; font-size: 0.9rem; } small { color: #64748b; font-size: 0.75rem; } } button { padding: 0.5rem 1.25rem; border-radius: 8px; background: #f1f5f9; color: #0f172a; border: 1px solid #e2e8f0; font-weight: 600; cursor: pointer; &:disabled { opacity: 0.5; cursor: not-allowed; } &:hover:not(:disabled) { background: #e2e8f0; } } `;
_c13 = StickyPagination;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13;
__turbopack_context__.k.register(_c, "AdminAccountsPage");
__turbopack_context__.k.register(_c1, "PageLayout");
__turbopack_context__.k.register(_c2, "SectionTitle");
__turbopack_context__.k.register(_c3, "AdminGrid");
__turbopack_context__.k.register(_c4, "AdminCard");
__turbopack_context__.k.register(_c5, "HeaderControls");
__turbopack_context__.k.register(_c6, "PageSelector");
__turbopack_context__.k.register(_c7, "SearchInput");
__turbopack_context__.k.register(_c8, "UserGrid");
__turbopack_context__.k.register(_c9, "UserCard");
__turbopack_context__.k.register(_c10, "Avatar");
__turbopack_context__.k.register(_c11, "DeleteBtn");
__turbopack_context__.k.register(_c12, "EmptyState");
__turbopack_context__.k.register(_c13, "StickyPagination");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_app_admin_accounts_page_tsx_44ec2635._.js.map