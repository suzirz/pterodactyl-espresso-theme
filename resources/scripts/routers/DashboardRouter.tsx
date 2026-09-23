import React, { useState, useEffect, useRef } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import Spinner from '@/components/elements/Spinner';
import routes from '@/routers/routes';
import styled from 'styled-components/macro';

const LayoutWrapper = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #141211;
    width: 100%;
    box-sizing: border-box;

    @media (min-width: 1024px) {
        height: 100vh;
        max-height: 100vh;
        overflow: hidden;
    }
`;

const ContentArea = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    @media (min-width: 1024px) {
        margin-left: 250px;
        width: calc(100% - 250px);
        height: 100vh;
        max-height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
    }
`;

const InnerPageWrapper = styled.div`
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    padding-bottom: 32px;
`;

export default () => {
    const location = useLocation();
    const contentRef = useRef<HTMLDivElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [location.pathname]);

    return (
        <LayoutWrapper>
            <DashboardSidebar
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />
            <ContentArea ref={contentRef}>
                <DashboardTopBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onOpenMobile={() => setMobileOpen(true)}
                />
                <InnerPageWrapper>
                    <TransitionRouter>
                        <React.Suspense fallback={<Spinner centered />}>
                            <Switch location={location}>
                                <Route path={'/'} exact>
                                    <DashboardContainer searchQuery={searchQuery} />
                                </Route>
                                {routes.account.map(({ path, component: Component }) => (
                                    <Route key={path} path={`/account/${path}`.replace('//', '/')} exact>
                                        <Component />
                                    </Route>
                                ))}
                                <Route path={'*'}>
                                    <NotFound />
                                </Route>
                            </Switch>
                        </React.Suspense>
                    </TransitionRouter>
                </InnerPageWrapper>
            </ContentArea>
        </LayoutWrapper>
    );
};
