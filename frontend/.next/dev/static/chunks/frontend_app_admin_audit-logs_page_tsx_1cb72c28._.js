(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/app/admin/audit-logs/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuditLogsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/styled-components/dist/styled-components.browser.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/jspdf/dist/jspdf.es.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function AuditLogsPage() {
    _s();
    // Added <any[]> to fix the VS Code "never[]" error
    const [logs, setLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const itemsPerPage = 15;
    const fetchLogs = ()=>{
        setLoading(true);
        fetch('http://localhost:5001/api/audit-logs', {
            credentials: 'include'
        }).then((res)=>res.json()).then((data)=>{
            // Safe check: if data isn't an array, use empty array
            setLogs(Array.isArray(data) ? data : []);
            setLoading(false);
        }).catch(()=>{
            setLogs([]);
            setLoading(false);
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuditLogsPage.useEffect": ()=>{
            fetchLogs();
        }
    }["AuditLogsPage.useEffect"], []);
    const clearLogs = async ()=>{
        if (!window.confirm("CRITICAL ACTION: Are you sure you want to delete all audit history?")) return;
        try {
            const res = await fetch('http://localhost:5001/api/audit-logs/clear', {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                fetchLogs();
                alert("History cleared successfully.");
            }
        } catch (err) {
            alert("Error clearing logs.");
        }
    };
    const filteredLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuditLogsPage.useMemo[filteredLogs]": ()=>{
            // Ensure logs is an array before filtering
            const safeLogs = Array.isArray(logs) ? logs : [];
            return safeLogs.filter({
                "AuditLogsPage.useMemo[filteredLogs]": (log)=>log.details?.toLowerCase().includes(searchQuery.toLowerCase()) || log.action?.toLowerCase().includes(searchQuery.toLowerCase()) || log.admin?.toLowerCase().includes(searchQuery.toLowerCase())
            }["AuditLogsPage.useMemo[filteredLogs]"]);
        }
    }["AuditLogsPage.useMemo[filteredLogs]"], [
        logs,
        searchQuery
    ]);
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const currentData = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const generatePDF = ()=>{
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
        const dateStr = new Date().toLocaleDateString();
        doc.setFontSize(18);
        doc.text('Sindjelic Club - Security Audit Report', 14, 22);
        const tableRows = logs.map((log)=>[
                new Date(log.created_at).toLocaleString(),
                log.admin,
                log.action,
                log.details
            ]);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(doc, {
            startY: 40,
            head: [
                [
                    'Timestamp',
                    'Admin Email',
                    'Action',
                    'Details'
                ]
            ],
            body: tableRows,
            theme: 'striped',
            headStyles: {
                fillColor: [
                    15,
                    23,
                    42
                ]
            },
            styles: {
                fontSize: 8
            }
        });
        doc.save(`Security_Report_${dateStr.replace(/\//g, '-')}.pdf`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PageContainer, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeaderSection, {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Title, {
                                    children: "Security Audit Logs"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Subtitle, {
                                    children: "Monitor administrative actions and system security events."
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SearchInput, {
                                    placeholder: "Search logs...",
                                    value: searchQuery,
                                    onChange: (e)=>{
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DownloadButton, {
                                    onClick: generatePDF,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "16",
                                            height: "16",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                                lineNumber: 104,
                                                columnNumber: 113
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                            lineNumber: 104,
                                            columnNumber: 15
                                        }, this),
                                        "Download Report"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ClearButton, {
                                    onClick: clearLogs,
                                    children: "Clear History"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusBadge, {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "dot"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                            lineNumber: 108,
                                            columnNumber: 26
                                        }, this),
                                        " Active"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableWrapper, {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LogTable, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Event Timestamp"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                            lineNumber: 116,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Administrator"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                            lineNumber: 117,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Action Type"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                            lineNumber: 118,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Event Details"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                    lineNumber: 115,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: 4,
                                        style: {
                                            textAlign: 'center',
                                            padding: '3rem'
                                        },
                                        children: "Fetching security logs..."
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                        lineNumber: 124,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                    lineNumber: 124,
                                    columnNumber: 17
                                }, this) : currentData.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: 4,
                                        style: {
                                            textAlign: 'center',
                                            padding: '3rem'
                                        },
                                        children: "No security events recorded."
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                        lineNumber: 126,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                    lineNumber: 126,
                                    columnNumber: 17
                                }, this) : currentData.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "timestamp",
                                                children: new Date(log.created_at).toLocaleString('en-GB', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                                lineNumber: 130,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "admin-email",
                                                title: log.admin,
                                                children: log.admin
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                                lineNumber: 133,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: {
                                                    width: '1%'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                    type: log.action,
                                                    children: log.action.replace(/_/g, ' ')
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                                    lineNumber: 137,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                                lineNumber: 136,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "details",
                                                children: log.details
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                                lineNumber: 139,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, log.id, true, {
                                        fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                        lineNumber: 129,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                    lineNumber: 112,
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
                                fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                        lineNumber: 151,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        children: [
                                            filteredLogs.length,
                                            " Total Events"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                disabled: currentPage === totalPages || totalPages === 0,
                                onClick: ()=>setCurrentPage((p)=>p + 1),
                                children: "Next →"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                                lineNumber: 154,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                        lineNumber: 148,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
            lineNumber: 91,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/admin/audit-logs/page.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_s(AuditLogsPage, "asNd54bjED6XKxI1PfnUHw5JuIM=");
_c = AuditLogsPage;
const PageContainer = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` padding: 2.5rem; background-color: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; `;
_c1 = PageContainer;
const HeaderSection = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; `;
_c2 = HeaderSection;
const Title = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].h1` font-size: 1.875rem; font-weight: 800; color: #0f172a; margin: 0; `;
_c3 = Title;
const Subtitle = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].p` color: #64748b; margin-top: 0.5rem; `;
_c4 = Subtitle;
const SearchInput = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].input` padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0; width: 240px; `;
_c5 = SearchInput;
const DownloadButton = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].button` display: flex; align-items: center; gap: 0.5rem; background: #0f172a; color: white; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 600; cursor: pointer; `;
_c6 = DownloadButton;
const ClearButton = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].button` background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; &:hover { background: #ffe4e6; } `;
_c7 = ClearButton;
const StatusBadge = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 600; color: #059669; background: #ecfdf5; padding: 0.5rem 0.75rem; border-radius: 9999px; border: 1px solid #d1fae5; .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; } `;
_c8 = StatusBadge;
const TableWrapper = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div` background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; `;
_c9 = TableWrapper;
const LogTable = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  table-layout: auto; /* Allows columns to adjust based on content */

  th { 
    background: #f1f5f9; 
    padding: 1rem 1.25rem; 
    text-align: left; 
    font-weight: 700; 
    color: #475569; 
    text-transform: uppercase; 
    font-size: 0.75rem;
    white-space: nowrap;
  }

  td { 
    padding: 1rem 1.25rem; 
    color: #1e293b; 
    border-bottom: 1px solid #f1f5f9; 
    vertical-align: middle;
  }

  .admin-email { 
    font-weight: 600; 
    color: #475569; 
    font-size: 0.85rem; 
    max-width: 200px; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap; 
  }

  .timestamp { 
    font-family: 'JetBrains Mono', monospace; 
    color: #64748b; 
    font-size: 0.8rem; 
    white-space: nowrap; 
    width: 180px; /* Fixed width for consistency */
  }

  .details { 
    color: #334155; 
    font-weight: 500;
    min-width: 250px; /* Ensures details have the most room */
    line-height: 1.4;
  }
`;
_c10 = LogTable;
const Badge = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap; /* ⚡️ CRITICAL: Prevents "ADMIN LOGIN" from breaking into two lines */
  letter-spacing: 0.02em;
  
  background: ${(props)=>{
    const t = props.type.toUpperCase();
    if (t.includes('DELETE') || t.includes('CLEAR')) return '#fef2f2';
    if (t.includes('LOGIN')) return '#f0fdf4';
    return '#eff6ff';
}};
  
  color: ${(props)=>{
    const t = props.type.toUpperCase();
    if (t.includes('DELETE') || t.includes('CLEAR')) return '#dc2626';
    if (t.includes('LOGIN')) return '#16a34a';
    return '#2563eb';
}};

  border: 1px solid ${(props)=>{
    const t = props.type.toUpperCase();
    if (t.includes('DELETE') || t.includes('CLEAR')) return '#fecdd3';
    if (t.includes('LOGIN')) return '#dcfce7';
    return '#dbeafe';
}};
`;
_c11 = Badge;
const StickyPagination = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div`
  position: sticky; bottom: 2rem; background: white; border: 1px solid #e2e8f0; border-radius: 50px; padding: 0.6rem 1.5rem; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); margin-top: 2rem; z-index: 20;
  .inner { display: flex; justify-content: space-between; align-items: center; }
  .page-info { text-align: center; b { display: block; font-size: 0.85rem; } small { font-size: 0.7rem; color: #64748b; } }
  button { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 0.5rem 1.2rem; border-radius: 20px; font-weight: 700; cursor: pointer; &:disabled { opacity: 0.4; } }
`;
_c12 = StickyPagination;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "AuditLogsPage");
__turbopack_context__.k.register(_c1, "PageContainer");
__turbopack_context__.k.register(_c2, "HeaderSection");
__turbopack_context__.k.register(_c3, "Title");
__turbopack_context__.k.register(_c4, "Subtitle");
__turbopack_context__.k.register(_c5, "SearchInput");
__turbopack_context__.k.register(_c6, "DownloadButton");
__turbopack_context__.k.register(_c7, "ClearButton");
__turbopack_context__.k.register(_c8, "StatusBadge");
__turbopack_context__.k.register(_c9, "TableWrapper");
__turbopack_context__.k.register(_c10, "LogTable");
__turbopack_context__.k.register(_c11, "Badge");
__turbopack_context__.k.register(_c12, "StickyPagination");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_app_admin_audit-logs_page_tsx_1cb72c28._.js.map