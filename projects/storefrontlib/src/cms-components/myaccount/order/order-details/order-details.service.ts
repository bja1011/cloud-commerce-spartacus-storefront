import { Injectable } from '@angular/core';
import {
  Order,
  OrderCancellation,
  OrderManagementConnector,
  CartDataService,
  OCC_USER_ID_ANONYMOUS,
  RoutingService,
  UserOrderService,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class OrderDetailsService {
  orderCode$: Observable<string>;
  orderLoad$: Observable<{}>;

  constructor(
    userOrderService: UserOrderService,
    routingService: RoutingService,
    cartDataService?: CartDataService // tslint:disable-line
  );
  /**
   * @deprecated since 1.x
   * NOTE: check issue:#1225 for more info
   *
   * TODO(issue:#1225) Deprecated since 1.x
   */
  constructor(
    userOrderService: UserOrderService,
    routingService: RoutingService
  );

  constructor(
    private userOrderService: UserOrderService,
    private routingService: RoutingService,
    private cartDataService?: CartDataService,
    private orderManagementConnector?: OrderManagementConnector
  ) {
    this.orderCode$ = this.routingService
      .getRouterState()
      .pipe(map(routingData => routingData.state.params.orderCode));

    this.orderLoad$ = this.orderCode$.pipe(
      tap(orderCode => {
        if (orderCode) {
          if (this.cartDataService.userId === OCC_USER_ID_ANONYMOUS) {
            this.userOrderService.loadOrderDetails(
              orderCode,
              OCC_USER_ID_ANONYMOUS
            );
          } else {
            this.userOrderService.loadOrderDetails(orderCode);
          }
        } else {
          this.userOrderService.clearOrderDetails();
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  getOrderDetails(): Observable<Order> {
    return this.orderLoad$.pipe(
      switchMap(() => this.userOrderService.getOrderDetails())
    );
  }

  isOrderCancellable(order: Order): boolean {
    const cancellableStatuses = ['CANCELLED', 'SHIPPED', 'READY'];
    return (
      cancellableStatuses.find(status => order.status === status) === undefined
    );
  }

  cancelOrder(order: Order): Observable<OrderCancellation> {
    return this.orderManagementConnector.cancelOrder(
      'CustomerSupportManager',
      order.code
    );
  }
}
