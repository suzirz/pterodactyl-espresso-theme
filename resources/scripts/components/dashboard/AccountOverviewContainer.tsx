import * as React from 'react';
import styled from 'styled-components/macro';
import ContentBox from '@/components/elements/ContentBox';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import UpdateEmailAddressForm from '@/components/dashboard/forms/UpdateEmailAddressForm';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';
import DiscordAccountBox from '@/components/dashboard/forms/DiscordAccountBox';
import PageContentBlock from '@/components/elements/PageContentBlock';
import MessageBox from '@/components/MessageBox';
import { useLocation } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faCrown, faLock, faShieldAlt, faBan } from '@fortawesome/free-solid-svg-icons';

const HeaderBanner = styled.div`
    background: #1c1917;
    border: 1px solid rgba(139, 120, 109, 0.25);
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`;

const HeaderInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const IconBadge = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 18px;
    flex-shrink: 0;
`;

const Title = styled.h2`
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #EBF5EE;
    margin: 0 0 4px 0;
`;

const Subtitle = styled.p`
    font-size: 13px;
    color: #8B786D;
    margin: 0;
`;

const UserPill = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 9999px;
    background: #25211e;
    border: 1px solid rgba(139, 120, 109, 0.3);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #EBF5EE;
`;

const DemoNoticeBanner = styled.div`
    background: linear-gradient(135deg, rgba(221, 151, 84, 0.12), rgba(37, 33, 30, 0.65));
    border: 1px solid rgba(221, 151, 84, 0.35);
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
`;

const DemoNoticeLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 260px;
`;

const DemoIconBox = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(221, 151, 84, 0.15);
    border: 1px solid rgba(221, 151, 84, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #dd9754;
    font-size: 16px;
    flex-shrink: 0;
`;

const DemoNoticeTitle = styled.h4`
    font-family: 'Outfit', sans-serif;
    font-size: 14.5px;
    font-weight: 700;
    color: #EBF5EE;
    margin: 0 0 2px 0;
`;

const DemoNoticeDesc = styled.p`
    font-family: 'Outfit', sans-serif;
    font-size: 12.5px;
    color: #a39288;
    margin: 0;
    line-height: 1.45;
`;

const DemoPill = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 9999px;
    background: rgba(221, 151, 84, 0.15);
    border: 1px solid rgba(221, 151, 84, 0.35);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    color: #dd9754;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

const FormsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @media (min-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const LockedContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 36px 20px;
    min-height: 220px;
`;

const LockedIconCircle = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(191, 168, 158, 0.08);
    border: 1px solid rgba(191, 168, 158, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 18px;
    margin-bottom: 14px;
`;

const LockedTitle = styled.h4`
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #EBF5EE;
    margin: 0 0 6px 0;
`;

const LockedDesc = styled.p`
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: #8B786D;
    max-width: 320px;
    line-height: 1.5;
    margin: 0 0 16px 0;
`;

const LockedBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 9999px;
    background: rgba(191, 168, 158, 0.08);
    border: 1px solid rgba(191, 168, 158, 0.2);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #BFA89E;
`;

const LockedCardComponent: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
    <LockedContainer>
        <LockedIconCircle>
            <FontAwesomeIcon icon={faLock} />
        </LockedIconCircle>
        <LockedTitle>{title}</LockedTitle>
        <LockedDesc>{desc}</LockedDesc>
        <LockedBadge>
            <FontAwesomeIcon icon={faBan} style={{ fontSize: 10 }} />
            <span>Disabled in Demo</span>
        </LockedBadge>
    </LockedContainer>
);

export default () => {
    const { state } = useLocation<undefined | { twoFactorRedirect?: boolean }>();
    const user = useStoreState((s) => s.user.data);

    const isDemo =
        user?.username === 'demo' ||
        user?.email === 'demo@bytenodes.id' ||
        (window as any).PterodactylUser?.username === 'demo' ||
        (window as any).PterodactylUser?.email === 'demo@bytenodes.id';

    return (
        <PageContentBlock title={'Account Overview'}>
            <HeaderBanner>
                <HeaderInfo>
                    <IconBadge>
                        <FontAwesomeIcon icon={faUserShield} />
                    </IconBadge>
                    <div>
                        <Title>Account Settings & Security</Title>
                        <Subtitle>Manage personal credentials, update your primary email address, and configure two-factor authentication.</Subtitle>
                    </div>
                </HeaderInfo>
                {user && (
                    <UserPill>
                        {user.rootAdmin && <FontAwesomeIcon icon={faCrown} style={{ color: '#fbbf24' }} />}
                        <span>{user.username}</span>
                        <span style={{ color: '#8B786D' }}>({user.email})</span>
                    </UserPill>
                )}
            </HeaderBanner>

            {isDemo && (
                <DemoNoticeBanner>
                    <DemoNoticeLeft>
                        <DemoIconBox>
                            <FontAwesomeIcon icon={faLock} />
                        </DemoIconBox>
                        <div>
                            <DemoNoticeTitle>Demo Account &bull; Read-Only Mode</DemoNoticeTitle>
                            <DemoNoticeDesc>
                                Password modification, email updates, two-step verification, and Discord linking are permanently locked to preserve public demo integrity.
                            </DemoNoticeDesc>
                        </div>
                    </DemoNoticeLeft>
                    <DemoPill>
                        <FontAwesomeIcon icon={faShieldAlt} /> Read-Only
                    </DemoPill>
                </DemoNoticeBanner>
            )}

            {state?.twoFactorRedirect && (
                <MessageBox title={'2-Factor Authentication Required'} type={'error'}>
                    Your account must have two-factor authentication enabled in order to access this server resource.
                </MessageBox>
            )}

            <FormsGrid>
                <ContentBox title={'Update Password'} showFlashes={'account:password'}>
                    {isDemo ? (
                        <LockedCardComponent
                            title={'Password Changes Disabled'}
                            desc={'You cannot change or update the password for the shared public demo account.'}
                        />
                    ) : (
                        <UpdatePasswordForm />
                    )}
                </ContentBox>
                <ContentBox title={'Update Email Address'} showFlashes={'account:email'}>
                    {isDemo ? (
                        <LockedCardComponent
                            title={'Email Updates Disabled'}
                            desc={'The primary email (demo@bytenodes.id) is locked and cannot be changed.'}
                        />
                    ) : (
                        <UpdateEmailAddressForm />
                    )}
                </ContentBox>
                <ContentBox title={'Two-Step Verification'}>
                    {isDemo ? (
                        <LockedCardComponent
                            title={'2-Factor Authentication Locked'}
                            desc={'Two-step verification cannot be enabled, disabled, or configured on the demo account.'}
                        />
                    ) : (
                        <ConfigureTwoFactorForm />
                    )}
                </ContentBox>
                <ContentBox title={'Discord Integration'}>
                    {isDemo ? (
                        <LockedCardComponent
                            title={'Discord Linking Disabled'}
                            desc={'Discord role synchronization and account linking are disabled in demo mode.'}
                        />
                    ) : (
                        <DiscordAccountBox />
                    )}
                </ContentBox>
            </FormsGrid>
        </PageContentBlock>
    );
};
