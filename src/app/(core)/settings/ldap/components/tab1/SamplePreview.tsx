import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Search,
  Users,
  Download,
  ChevronDown,
  ChevronRight,
  User,
  X,
} from "lucide-react";

// Sample LDAP user data for demonstration
const sampleUsers = [
  {
    dn: "cn=John Doe,ou=users,dc=example,dc=com",
    cn: "John Doe",
    mail: "john.doe@example.com",
    displayName: "John Doe",
    givenName: "John",
    sn: "Doe",
    userPrincipalName: "john.doe@example.com",
    department: "Engineering",
    title: "Senior Developer",
    mobile: "+1-555-0123",
    objectClass: ["person", "organizationalPerson", "user"],
  },
  {
    dn: "cn=Jane Smith,ou=users,dc=example,dc=com",
    cn: "Jane Smith",
    mail: "jane.smith@example.com",
    displayName: "Jane Smith",
    givenName: "Jane",
    sn: "Smith",
    userPrincipalName: "jane.smith@example.com",
    department: "Marketing",
    title: "Marketing Manager",
    mobile: "+1-555-0124",
    objectClass: ["person", "organizationalPerson", "user"],
  },
  {
    dn: "cn=Mike Johnson,ou=users,dc=example,dc=com",
    cn: "Mike Johnson",
    mail: "mike.johnson@example.com",
    displayName: "Mike Johnson",
    givenName: "Mike",
    sn: "Johnson",
    userPrincipalName: "mike.johnson@example.com",
    department: "Sales",
    title: "Sales Representative",
    mobile: "+1-555-0125",
    objectClass: ["person", "organizationalPerson", "user"],
  },
];

// JSON syntax highlighting component
const JsonView = ({
  data,
  searchTerm = "",
}: {
  data: any;
  searchTerm: string;
}) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set(["root"]));

  const toggleNode = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const highlightSearchTerm = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(
      `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-yellow-200 dark:bg-yellow-600/30 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const renderValue = (value: any, key = "", path = "", depth = 0) => {
    if (value === null) {
      return <span className="text-gray-500 dark:text-gray-400">null</span>;
    }

    if (typeof value === "boolean") {
      return (
        <span className="text-blue-600 dark:text-blue-400 font-medium">
          {value.toString()}
        </span>
      );
    }

    if (typeof value === "number") {
      return (
        <span className="text-purple-600 dark:text-purple-400 font-medium">
          {value}
        </span>
      );
    }

    if (typeof value === "string") {
      return (
        <span className="text-green-600 dark:text-green-400">
          "{highlightSearchTerm(value, searchTerm)}"
        </span>
      );
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedNodes.has(path);
      return (
        <div>
          <Button size="sm" variant="ghost" onClick={() => toggleNode(path)}>
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
            <span className="ml-1 text-gray-600 dark:text-gray-400">
              [{value.length}]
            </span>
          </Button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {value.map((item, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-gray-500 dark:text-gray-400 mr-3 text-xs font-mono mt-0.5 w-6 text-right">
                    {index}
                  </span>
                  <div className="flex-1">
                    {renderValue(
                      item,
                      index.toString(),
                      `${path}[${index}]`,
                      depth + 1
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === "object") {
      const isExpanded = expandedNodes.has(path);
      const keys = Object.keys(value);

      return (
        <div>
          <Button size="sm" variant="ghost" onClick={() => toggleNode(path)}>
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
            <span className="ml-1 text-gray-600 dark:text-gray-400">{`{${keys.length}}`}</span>
          </Button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-2">
              {keys.map((objKey) => (
                <div key={objKey} className="flex items-start">
                  <span className="text-blue-700 dark:text-blue-300 mr-3 font-medium shrink-0">
                    "{highlightSearchTerm(objKey, searchTerm)}":
                  </span>
                  <div className="flex-1 min-w-0">
                    {renderValue(
                      value[objKey],
                      objKey,
                      `${path}.${objKey}`,
                      depth + 1
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <span className="text-gray-800 dark:text-gray-200">{String(value)}</span>
    );
  };

  return (
    <div className="font-mono text-sm leading-relaxed">
      {renderValue(data, "", "root", 0)}
    </div>
  );
};

// User card component for the sidebar
const UserCard = ({
  user,
  isSelected,
  onClick,
}: {
  user: any;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <User className="w-4 h-4 text-gray-500" />
        <span className="font-medium text-sm truncate">
          {user.cn || user.displayName}
        </span>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
        {user.mail}
      </div>
      {user.department && (
        <Badge variant="secondary" className="mt-2 text-xs">
          {user.department}
        </Badge>
      )}
    </div>
  );
};

// Main modal component
export function LdapJsonModal({
  isOpen,
  onClose,
  users = sampleUsers,
}: {
  isOpen: boolean;
  onClose: () => void;
  users: any[];
}) {
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("pretty");

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter((user) =>
      JSON.stringify(user).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const selectedUser = filteredUsers[selectedUserIndex] || filteredUsers[0];

  const copyToClipboard = async (data: any) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      // You can replace this with your toast implementation
      console.log("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadJson = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ldap-users-sample.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setSelectedUserIndex(0);
  }, [users]);

  if (!isOpen) return null;

  // Modal backdrop and content
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm h-screen"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-7xl mx-4 h-[80vh] flex flex-col border dark:border-gray-800">
        {/* Header */}
        <div className="p-6 border-b dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">LDAP Users Preview</h2>
                <Badge variant="secondary">{users.length} users</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Preview sample users returned from your LDAP query. Click on a
                user to view their details.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(selectedUser)}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy User
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(users)}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy All
              </Button>
              <Button variant="outline" size="sm" onClick={downloadJson}>
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 min-h-0">
          {/* Users sidebar */}
          <div className="lg:col-span-1 h-full overflow-y-auto">
            <div className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Users ({filteredUsers.length})
            </div>
            <div className="h-full overflow-y-auto pr-2 space-y-2">
              {filteredUsers.map((user, index) => (
                <UserCard
                  key={index}
                  user={user}
                  isSelected={index === selectedUserIndex}
                  onClick={() => setSelectedUserIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* JSON viewer */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                User Details: {selectedUser?.displayName || selectedUser?.cn}
              </div>
              <div className="flex gap-1 ml-4">
                <Button
                  variant={viewMode === "pretty" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("pretty")}
                >
                  Pretty
                </Button>
                <Button
                  variant={viewMode === "raw" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("raw")}
                >
                  Raw
                </Button>
              </div>
            </div>

            <div className="flex-1 border rounded-lg overflow-hidden">
              <div className="h-full overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50">
                {viewMode === "pretty" ? (
                  <JsonView data={selectedUser} searchTerm={searchTerm} />
                ) : (
                  <pre className="font-mono text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                    {JSON.stringify(selectedUser, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo component to show how to use the modal
// export default function LdapJsonModalDemo() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">LDAP JSON Modal Demo</h1>
//         <Button size="sm" onClick={() => setIsModalOpen(true)}>
//           <Users className="w-4 h-4 mr-2" />
//           Preview Sample Users
//         </Button>

//         <LdapJsonModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           users={sampleUsers}
//         />
//       </div>
//     </div>
//   );
// }
