"use client";

import { useQuery } from "@tanstack/react-query";
import { RotateCcw, Star } from "lucide-react";
import { Async } from "@/components/Async";
import { DeleteButton } from "@/components/DeleteButton";
import { MutateForm } from "@/components/MutateForm";
import { NavLink } from "@/components/NavLink";
import { PlanningTabs } from "@/components/PlanningTabs";
import { ProgressBar } from "@/components/ProgressBar";
import { formatMinutes } from "@/lib/format";
import { queries } from "@/lib/queries";
import { activatePlanAction, deletePlanAction, resetRoundAction } from "@/features/plans/actions";
import { PlanForm } from "@/features/plans/components/PlanForm";
import { PlanItemForm } from "@/features/plans/components/PlanItemForm";
import { CycleItemRow } from "@/features/plans/components/CycleItemRow";

export function CycleScreen({ plano }: { plano?: string }) {
  const query = useQuery(queries.cycle(plano));

  return (
    <>
      <div className="page-header">
        <h1>Ciclo de estudos</h1>
      </div>
      <PlanningTabs active="cycle" />

      <div className="card">
        <h2>Novo ciclo</h2>
        <PlanForm />
      </div>

      <Async query={query}>
        {({ plans, selectedId, plan, subjects }) => {
          const items = plan?.items ?? [];
          const doneCount = items.filter((i) => i.doneInRound).length;
          const nextId = items.find((i) => !i.doneInRound)?.id;
          const totalMinutes = items.reduce((sum, i) => sum + i.minutes, 0);

          return (
            <>
              {plans.length > 0 && (
                <div className="plan-chips">
                  {plans.map((p) => (
                    <NavLink
                      key={p.id}
                      to={`/planejamento/ciclo?plano=${p.id}`}
                      className={`chip ${p.id === selectedId ? "active" : ""}`}
                    >
                      {p.isActive && <Star size={12} />} {p.name}
                    </NavLink>
                  ))}
                </div>
              )}

              {plan && (
                <>
                  <div className="card">
                    <div className="page-header">
                      <div>
                        <h2>{plan.name}</h2>
                        <p className="muted small">
                          {plan.isActive ? "Ciclo ativo" : "Ciclo inativo"} · Rodada {plan.rounds + 1} ·{" "}
                          {items.length} bloco(s) · {formatMinutes(totalMinutes)} por rodada
                        </p>
                      </div>
                      <div className="row-actions">
                        {!plan.isActive && (
                          <MutateForm action={activatePlanAction}>
                            <input type="hidden" name="id" value={plan.id} />
                            <button type="submit" className="btn-small">
                              Tornar ativo
                            </button>
                          </MutateForm>
                        )}
                        <DeleteButton
                          action={deletePlanAction}
                          fields={{ id: plan.id }}
                          message="Excluir este ciclo?"
                        />
                      </div>
                    </div>

                    {items.length > 0 && <ProgressBar done={doneCount} total={items.length} />}
                  </div>

                  <div className="card">
                    <div className="page-header">
                      <h2>Blocos do ciclo</h2>
                      {doneCount > 0 && (
                        <MutateForm action={resetRoundAction}>
                          <input type="hidden" name="id" value={plan.id} />
                          <button type="submit" className="btn-small">
                            <RotateCcw size={14} /> Reiniciar rodada
                          </button>
                        </MutateForm>
                      )}
                    </div>

                    {items.length === 0 ? (
                      <p className="muted">Adicione as disciplinas na ordem em que quer estudá-las.</p>
                    ) : (
                      <>
                        <p className="muted small">
                          O ciclo segue de onde você parou: marque cada bloco ao concluir, sem depender do
                          dia da semana. Ao concluir todos, uma nova rodada começa.
                        </p>
                        <ol className="cycle-list">
                          {items.map((item, index) => (
                            <CycleItemRow
                              key={item.id}
                              item={item}
                              index={index}
                              isNext={item.id === nextId}
                              isFirst={index === 0}
                              isLast={index === items.length - 1}
                            />
                          ))}
                        </ol>
                      </>
                    )}
                  </div>

                  <div className="card">
                    <h2>Adicionar bloco</h2>
                    {subjects.length === 0 ? (
                      <p className="muted">
                        Cadastre disciplinas primeiro em <NavLink to="/disciplinas">Disciplinas</NavLink>.
                      </p>
                    ) : (
                      <PlanItemForm planId={plan.id} subjects={subjects} />
                    )}
                  </div>
                </>
              )}
            </>
          );
        }}
      </Async>
    </>
  );
}
