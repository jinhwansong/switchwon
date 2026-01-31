import PageSection from '@/components/common/PageSection';
import { useOrders } from '@/hooks/useExchange';
import { formatNumber, formatRate } from '@/utils/format';

export default function HistoryPage() {
  const { data: ordersData, isPending } = useOrders();
  const list = ordersData?.data ?? [];

  return (
    <PageSection title="환전 내역" subtitle="환전 내역을 확인하실 수 있어요.">
      <div className="rounded-2xl border border-(--gray-300) bg-(--gray-white) py-4">
        <div className="overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-t border-b border-(--gray-300) px-6">
              <tr className="text-sm text-(--gray-600)">
                <th className="px-4 py-3.5">거래 ID</th>
                <th className="px-4 py-3.5">거래 일시</th>
                <th className="px-4 py-3.5 text-right">지불 금액</th>
                <th className="px-4 py-3.5 text-right">체결 환율</th>
                <th className="px-4 py-3.5 text-right">체결 금액</th>
              </tr>
            </thead>

            <tbody className="text-sm text-(--gray-700)">
              {isPending ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-(--gray-500)"
                  >
                    불러오는 중...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-(--gray-500)"
                  >
                    환전 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                list.map((order) => (
                  <tr key={order.orderId}>
                    <td className="px-4 py-3.5">{order.orderId}</td>
                    <td className="px-4 py-3.5">{order.orderedAt}</td>
                    <td className="px-4 py-3.5 text-right">
                      {formatNumber(order.fromAmount)} {order.fromCurrency}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {formatRate(order.appliedRate)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {formatNumber(order.toAmount)} {order.toCurrency}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageSection>
  );
}
