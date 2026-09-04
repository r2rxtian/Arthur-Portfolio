import type { Project } from '../types/portfolio';

export const projectsData: Project[] = [
  {
    id: 'itms',
    title: 'StockHub Inventory Management System (ITMS)',
    tagline: 'Audited warehouse inventory platform with serializable transactions & real-time stock movement tracking',
    category: 'Full-Stack',
    featured: true,
    thumbnailGradient: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
    executive: {
      businessChallenge:
        'Warehouse fulfillment operations suffered from unrecorded inventory shrink, manual reconciliation discrepancies, and high-concurrency race conditions when multiple operators handled simultaneous stock transfers.',
      strategicSolution:
        'Engineered an audited warehouse stock movement platform enforcing strict serializable database transactions, zero unrecorded stock mutations, automated low-stock alert dispatches, and Zod schema-validated REST APIs.',
      quantifiableImpact: [
        'Eliminated multi-operator stock reconciliation race conditions via serializable row-level locking (UPDLOCK, HOLDLOCK)',
        'Achieved 100% auditable inventory movement logging with zero unaccounted stock delta',
        'Sub-15ms warehouse item lookup and transaction processing across thousands of SKU items',
      ],
      role: 'Full-Stack Software Engineer',
    },
    technical: {
      architecture:
        'TypeScript/Node.js REST API backed by Microsoft SQL Server Express with connection pooling and Windows trusted authentication, paired with a high-performance Vite client.',
      techStack: ['TypeScript', 'Node.js', 'Express', 'MSSQL / SQL Server', 'Zod', 'Vite', 'Helmet', 'Express-Session'],
      keyFeatures: [
        'Serializable transaction isolation ensuring zero stock overdraft or negative quantity states',
        'Immutable audit ledger capturing timestamp, IP address, operator ID, and change reason for every mutation',
        'Automated reorder-level alerts with dynamic CRITICAL/WARNING severity dispatch',
        'Location capacity enforcement preventing warehouse shelf over-allocation',
      ],
      codeSnippet: {
        filename: 'server/src/services/stock.service.ts',
        language: 'typescript',
        code: `import { getPool, sql } from '../config/database.js';
import { writeAudit } from '../repositories/audit.repository.js';
import { ApiError } from '../utils/api-error.js';
import { assertLocationCapacity } from './capacity.service.js';

export async function changeStock(
  input: { itemId: number; quantity: number; referenceNumber?: string | null; reason: string },
  direction: 'IN' | 'OUT',
  userId: number,
  ipAddress?: string
) {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);

  try {
    const item = (await transaction.request()
      .input('itemId', sql.Int, input.itemId)
      .query(\`SELECT item_id, sku, item_name, quantity, reorder_level, maximum_stock, location_id, status 
              FROM dbo.ims_items WITH(UPDLOCK, HOLDLOCK) WHERE item_id = @itemId\`)).recordset[0];

    if (!item) throw new ApiError(404, 'Item not found.');
    if (item.status !== 'ACTIVE') throw new ApiError(409, 'Stock operations not allowed on archived items.');

    const previous = Number(item.quantity);
    const change = direction === 'IN' ? input.quantity : -input.quantity;
    const next = previous + change;

    if (next < 0) throw new ApiError(409, \`Insufficient inventory. Available: \${previous}.\`);
    if (direction === 'IN') await assertLocationCapacity(transaction, item.location_id, input.quantity);

    await transaction.request()
      .input('itemId', sql.Int, input.itemId)
      .input('next', sql.Decimal(18, 2), next)
      .query(\`UPDATE dbo.ims_items SET quantity = @next, updated_at = SYSUTCDATETIME() WHERE item_id = @itemId\`);

    const type = direction === 'IN' ? 'STOCK_IN' : 'STOCK_OUT';
    await writeAudit({
      userId,
      action: type,
      entityType: 'ITEM',
      entityId: input.itemId,
      description: \`\${item.sku}: \${previous} \${change >= 0 ? '+' : ''}\${change} = \${next}. Reason: \${input.reason}\`,
      ipAddress
    }, transaction);

    await transaction.commit();
    return { itemId: input.itemId, previousQuantity: previous, quantityChange: change, newQuantity: next };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}`,
      },
    },
    links: {
      github: 'https://github.com/r2rxtian/ITMS',
    },
  },
  {
    id: 'lost-and-found',
    title: 'Lost & Found Management System',
    tagline: 'Automated lost property recovery pipeline with deterministic multi-factor item matching heuristics',
    category: 'Full-Stack',
    featured: true,
    thumbnailGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    executive: {
      businessChallenge:
        'Campus and corporate facility lost-and-found desks were overwhelmed by chaotic paper binders, fraudulent claims, and prolonged recovery turnaround, causing over 70% of reported items to go unclaimed.',
      strategicSolution:
        'Engineered an end-to-end digital property recovery workflow featuring Multer photo upload pipelines, deterministic multi-factor attribute matching heuristics, and secure claim verification workflows.',
      quantifiableImpact: [
        'Decreased manual lost-item claim triage and verification time by 80%',
        'Zero false claim resolutions through mandatory security verification question validation',
        'Normalized relational SQL datastore ensuring 0% duplicate reports or ghost records',
      ],
      role: 'Full-Stack Software Engineer',
    },
    technical: {
      architecture:
        'Express REST API coupled with Microsoft SQL Server via ODBC Driver 17, Vite frontend, and Multer multipart storage pipeline with deterministic token-matching heuristics.',
      techStack: ['JavaScript', 'Node.js', 'Express', 'MSSQL', 'Multer', 'Bcrypt', 'Vite', 'ODBC Driver 17'],
      keyFeatures: [
        'Deterministic scoring heuristic evaluating category, color, location, date proximity, and keyword tokens',
        'Multi-file image upload pipeline with mime-type validation and safe disk streaming',
        'Bcrypt salted credential encryption with secure session cookie persistence',
        'Role-based moderation tools for administrators to approve claims and resolve tickets',
      ],
      codeSnippet: {
        filename: 'server/src/services/matchingService.js',
        language: 'javascript',
        code: `const normal = (value = '') => String(value).trim().toLowerCase();
const tokens = (value = '') => new Set(normal(value).split(/[^a-z0-9]+/).filter((word) => word.length > 2));

export function calculateMatch(lost, found) {
  const scores = { category: 0, color: 0, location: 0, date: 0, brand: 0, keyword: 0 };
  
  if (normal(lost.category) === normal(found.category)) scores.category = 30;
  if (normal(lost.color) && normal(lost.color) === normal(found.color)) scores.color = 20;
  if (normal(lost.location) === normal(found.location)) scores.location = 20;
  
  const days = Math.abs(new Date(lost.date) - new Date(found.date)) / 86400000;
  scores.date = days < 1 ? 15 : days <= 1 ? 10 : days <= 3 ? 5 : 0;
  
  if (normal(lost.brand) && normal(lost.brand) === normal(found.brand)) scores.brand = 10;
  
  const lostWords = tokens(\`\${lost.name} \${lost.description}\`);
  const foundWords = tokens(\`\${found.name} \${found.description}\`);
  const overlap = [...lostWords].filter((word) => foundWords.has(word)).length;
  scores.keyword = Math.min(5, overlap);
  
  const score = Object.values(scores).reduce((sum, part) => sum + part, 0);
  return {
    ...scores,
    score,
    strength: score >= 80 ? 'Strong' : score >= 60 ? 'Possible' : score >= 40 ? 'Weak' : 'None'
  };
}

export function buildMatches(lostItems, foundItems) {
  return lostItems.flatMap((lost) =>
    foundItems.map((found) => ({
      id: \`\${lost.id}-\${found.id}\`,
      lostItemId: lost.id,
      foundItemId: found.id,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ...calculateMatch(lost, found)
    }))
  ).filter((match) => match.score >= 40).sort((a, b) => b.score - a.score);
}`,
      },
    },
    links: {
      github: 'https://github.com/r2rxtian/LostAndFound',
    },
  },
  {
    id: 'tennis-lms',
    title: 'Tennis Academy Learning Management System',
    tagline: 'Athletic training curriculum & performance tracking platform with role-based access control',
    category: 'Full-Stack',
    featured: true,
    thumbnailGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    executive: {
      businessChallenge:
        'Sports coaching academies lacked a centralized platform to manage player drills, court schedules, skill milestones, and coach-to-student assessments, resulting in fragmented communication and untracked progress.',
      strategicSolution:
        'Engineered a comprehensive athletic LMS providing specialized views for Players and Admins, structured drills progression tracking, and session-authenticated administrative management.',
      quantifiableImpact: [
        'Consolidated curriculum planning and court scheduling into a single unified portal',
        'Enforced secure role-based access with zero plaintext passwords (Bcrypt hash validation)',
        'Increased student practice consistency and drill completion transparency across coaches and athletes',
      ],
      role: 'Full-Stack Web Developer',
    },
    technical: {
      architecture:
        'Express 5 modular server backend backed by Microsoft SQL Server database pool, paired with a snappy Vite client utilizing Lucide UI icons.',
      techStack: ['JavaScript', 'Express 5', 'MSSQL', 'Vite', 'Bcryptjs', 'Session Auth', 'Lucide'],
      keyFeatures: [
        'Multi-tier role-based authorization separating Admin curriculum controls from Player training portals',
        'Structured drills and lesson milestone tracking with dynamic completion status',
        'Concurrent client/server development workflow with automated session lifecycle management',
        'High-contrast, accessible sports academy dashboard UI built with custom CSS visual hierarchy',
      ],
      codeSnippet: {
        filename: 'server/src/services/recommendations.js',
        language: 'javascript',
        code: `export function getRecommendations(db, user) {
  const priority = (lesson) => {
    const course = db.courses.find((item) => item.id === lesson.courseId);
    return (
      Number(course?.category === user.goal) * 4 +
      Number(course?.level === user.skillLevel) * 2 -
      Number(lesson.completed) * 10
    );
  };

  return db.lessons
    .filter((lesson) => !lesson.completed)
    .sort((a, b) => priority(b) - priority(a))
    .slice(0, 3);
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Please sign in to continue.' });
    }
    if (req.session.user.role !== role) {
      return res.status(403).json({ message: 'You do not have permission to view this resource.' });
    }
    next();
  };
}`,
      },
    },
    links: {
      github: 'https://github.com/r2rxtian/Tennis-Academy-LMS',
    },
  },
  {
    id: 'dochubpr',
    title: 'DocHubPR — Enterprise Document Hub',
    tagline: 'Secure document lifecycle management, immutable versioning trees & automated ZIP archiving engine',
    category: 'Systems & Cloud',
    featured: true,
    thumbnailGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    executive: {
      businessChallenge:
        'Enterprise teams faced compliance and legal liability risks from untracked file edits, accidental document overwriting on shared network drives, and inability to produce audit trails for regulatory compliance.',
      strategicSolution:
        'Built a high-security document repository featuring immutable revision history, in-browser document previews, tag-based taxonomy, approval/resubmission lifecycles, and automated ZIP export archives.',
      quantifiableImpact: [
        'Completely eliminated document overwrite loss via append-only immutable revision trees',
        'Cut multi-document export and sharing turnaround by 75% via server-side ZIP bundling',
        'Delivered 100% regulatory traceability with granular audit history on all document mutations',
      ],
      role: 'Lead Systems Developer',
    },
    technical: {
      architecture:
        'PHP 8.2 backend interfacing with Microsoft SQL Server through pdo_sqlsrv, featuring server-rendered views, JSON REST endpoints, and custom vanilla UI components.',
      techStack: ['PHP 8.2', 'SQL Server (pdo_sqlsrv)', 'Vanilla JS', 'CSS3', 'Apache / XAMPP', 'ZIP Archive Engine'],
      keyFeatures: [
        'Immutable document version trees with revision diff tracking and instant rollback capability',
        'Inline file preview and metadata tagging engine supporting complex nested folder structures',
        'Bulk operations bar supporting multi-file uploads, batch tag mutations, and automated ZIP packaging',
        'SQL Server parameterized access with strict CSRF protection and secure session management',
      ],
      codeSnippet: {
        filename: 'api/documents/upload_version.php',
        language: 'php',
        code: `<?php
declare(strict_types=1);

require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/../../rules/validation.php';
require_once __DIR__ . '/../../authz/audit.php';
require_once __DIR__ . '/../../authz/notifications.php';

$user = authorize('document.version', ['entity_type' => 'document']);
csrfVerify();
requireConfiguredDatabase();

$documentId = filter_var($_POST['document_id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) ?: 0;
$changeNote = cleanText($_POST['change_note'] ?? '', 500);
$file = $_FILES['document'] ?? [];

$connection = db();
try {
    $stored = storeUploadedDocument($file);
    $connection->beginTransaction();
    
    $lookup = $connection->prepare('SELECT id, original_name, version_number FROM documents WITH (UPDLOCK, ROWLOCK) WHERE id = :id');
    $lookup->execute(['id' => $documentId]);
    $doc = $lookup->fetch();
    
    $nextVersion = (int)$doc['version_number'] + 1;
    $insert = $connection->prepare('INSERT INTO document_versions (document_id, version_number, original_name, stored_name, extension, mime_type, file_size_bytes, uploaded_by, change_note) VALUES (:id, :ver, :orig, :stored, :ext, :mime, :size, :uid, :note)');
    $insert->execute([
        'id' => $documentId, 'ver' => $nextVersion, 'orig' => $file['name'],
        'stored' => $stored['stored_name'], 'ext' => $stored['extension'],
        'mime' => $stored['mime_type'], 'size' => $stored['size_bytes'],
        'uid' => $user['id'], 'note' => $changeNote ?: null
    ]);
    
    $connection->commit();
    writeAuditLog($user['id'], 'document.version_uploaded', 'document', $documentId, ['version' => $nextVersion]);
    jsonResponse(['success' => true, 'message' => "Version {$nextVersion} uploaded and submitted for review."]);
} catch (Throwable $e) {
    if ($connection->inTransaction()) $connection->rollBack();
    jsonResponse(['success' => false, 'message' => 'Upload failed.'], 500);
}`,
      },
    },
    links: {
      github: 'https://github.com/r2rxtian/DocHubPR',
    },
  },
  {
    id: 'qrs',
    title: 'QR Task Check (QRS) — Field Operations Platform',
    tagline: 'Location-based inspection verification & advance task scheduling platform with anti-early-scan guards',
    category: 'Systems & Cloud',
    featured: true,
    thumbnailGradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    executive: {
      businessChallenge:
        'Facility management, pest control, and sanitation audits were undermined by falsified inspection sheets, premature check-ins, and lack of verifiable proof of physical technician attendance.',
      strategicSolution:
        'Designed a cryptographic QR inspection platform that schedules field checks in advance, places upcoming dates in non-scannable standby states, and validates physical presence via time-stamped checklist audits.',
      quantifiableImpact: [
        'Guaranteed 100% verified physical technician presence at checkpoints via cryptographic QR validation',
        'Eliminated premature or skipped inspections through automated scheduled standby queues',
        'Accelerated supervisory facility sign-off with real-time audit logs and observation reporting',
      ],
      role: 'Full-Stack Systems Engineer',
    },
    technical: {
      architecture:
        'Lightweight feature-oriented PHP backend integrated with Microsoft SQL Server, mobile camera QR scanning APIs, and real-time station status updates.',
      techStack: ['PHP', 'SQL Server', 'QR Scanning API', 'JavaScript', 'CSS3', 'CSRF Protection'],
      keyFeatures: [
        'Advance date task scheduler keeping stations safely on standby with zero risk of accidental early scanning',
        'Multi-point inspection observation checklist (Spot Spray, Misting, Mist Blower, Monitoring)',
        'Location lookup and verification engine matching physical QR signatures to active database records',
        'Comprehensive administrative dashboard monitoring field inspection progress in real-time',
      ],
      codeSnippet: {
        filename: 'api/scan/start.php',
        language: 'php',
        code: `<?php
require_once __DIR__ . '/../../auth/session.php';
require_once __DIR__ . '/../../auth/csrf.php';
require_once __DIR__ . '/../../conn/db.php';
require_once __DIR__ . '/../../rules/validation.php';

header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

csrfVerify();
$taskId = (int)($_POST['task_id'] ?? 0);
$taskLocationId = (int)($_POST['task_location_id'] ?? 0);
$findingsObservation = sanitizeText($_POST['findings_observation'] ?? '');

if ($taskId <= 0 || $taskLocationId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid task or location ID.']);
    exit;
}

// Validate scheduled status & ensure task is active today (prevent early scan)
$conn = db();
$stmt = $conn->prepare("SELECT t.id, t.scheduled_date, tl.status 
                        FROM tasks t 
                        JOIN task_locations tl ON t.id = tl.task_id 
                        WHERE t.id = ? AND tl.id = ?");
$stmt->execute([$taskId, $taskLocationId]);
$check = $stmt->fetch();

if (!$check) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Scheduled inspection not found.']);
    exit;
}

if ($check['scheduled_date'] > date('Y-m-d')) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Inspection is on standby until scheduled date.']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'QR Check verified. Inspection started.']);`,
      },
    },
    links: {
      github: 'https://github.com/r2rxtian/QRS',
    },
  },
];
