import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, Braces, Code2, Database, Monitor } from 'lucide-react';
import type { Project } from '../../types/portfolio';
import { projectArchitecture, type ArchitectureLayer } from './workbenchData';

const layerIcons = { interface: Monitor, application: Braces, data: Database };

export function ArchitecturePane({ project, onInspect }: { project: Project; onInspect: () => void }) {
  const [selectedLayer, setSelectedLayer] = useState<ArchitectureLayer>('application');
  const reducedMotion = useReducedMotion();
  const nodes = projectArchitecture[project.id] ?? [];
  const selected = nodes.find((node) => node.id === selectedLayer) ?? nodes[0];
  if (!selected) return <p>{project.technical.architecture}</p>;

  return (
    <div className="wb-architecture">
      <div className="wb-architecture-heading"><h2>How it fits together.</h2><p>Select a layer to explore its role in the system.</p></div>
      <div className="wb-system-flow" role="group" aria-label={`${project.title} architecture layers`}>
        {nodes.map((node, index) => {
          const Icon = layerIcons[node.id];
          return <div className="wb-flow-step" key={node.id}>
            <button className="wb-flow-node" aria-pressed={node.id === selectedLayer} onClick={() => setSelectedLayer(node.id)}>
              <Icon size={24} strokeWidth={1.5} /><span className="wb-node-layer">{node.id === 'data' ? 'Persistence' : node.id === 'application' ? 'Application' : 'Interface'}</span>
              <strong>{node.name}</strong><span className="wb-node-technology">{node.technology}</span>
            </button>
            {index < nodes.length - 1 && <span className="wb-flow-connector" aria-hidden="true"><ArrowRight size={16} /><ArrowDown size={16} /></span>}
          </div>;
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.section key={`${project.id}-${selected.id}`} className="wb-layer-detail"
          initial={reducedMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.16 }} aria-live="polite">
          <div><span className="wb-caption">{selected.technology}</span><h3>{selected.name}</h3><p>{selected.description}</p></div>
          <button className="wb-button wb-button-secondary" onClick={onInspect}><Code2 size={15} /> Inspect implementation</button>
        </motion.section>
      </AnimatePresence>
      <div className="wb-architecture-note"><h3>Architecture notes</h3><p>{project.technical.architecture}</p></div>
      <div className="wb-feature-list"><h3>Engineering decisions</h3><ul>{project.technical.keyFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
    </div>
  );
}
