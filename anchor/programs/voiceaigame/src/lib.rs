#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");
#[program]
pub mod prize_pool_contract {
    use super::*;

    pub fn initialize_prize_pool(
        ctx: Context<InitializePrizePool>,
        starting_prize_pool: u64,
        developer_wallet: Pubkey,
    ) -> Result<()> {
        let prize_pool = &mut ctx.accounts.prize_pool;
        prize_pool.amount = starting_prize_pool;
        prize_pool.developer_wallet = developer_wallet;
        Ok(())
    }

    pub fn session_payment(ctx: Context<SessionPayment>, fee_amount: u64) -> Result<()> {
        let prize_pool = &mut ctx.accounts.prize_pool;
        let developer_wallet = &mut ctx.accounts.developer_wallet;
        
        let fee_to_developer = fee_amount * 70 / 100;
        let fee_to_pool = fee_amount * 30 / 100;
        
        let user_wallet = &ctx.accounts.user_wallet;
        let user_balance = **user_wallet.lamports.borrow();
        
        if user_balance < fee_amount {
            return Err(ErrorCode::InsufficientFunds.into());
        }

        **user_wallet.lamports.borrow_mut() -= fee_amount;
        **developer_wallet.lamports.borrow_mut() += fee_to_developer;
        prize_pool.amount += fee_to_pool;
        
        msg!("Session Payment Completed: {} transferred to Developer, {} added to Prize Pool", fee_to_developer, fee_to_pool);

        Ok(())
    }

    pub fn get_current_prize_pool(ctx: Context<GetCurrentPrizePool>) -> Result<u64> {
        let prize_pool = &ctx.accounts.prize_pool;
        msg!("Current Prize Pool: {}", prize_pool.amount);
        Ok(prize_pool.amount)
    }
}

#[derive(Accounts)]
pub struct InitializePrizePool<'info> {
    #[account(init, payer = user, space = 8 + 32 + 8)] 
    pub prize_pool: Account<'info, PrizePool>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SessionPayment<'info> {
    #[account(mut)]
    pub user_wallet: Signer<'info>,
    #[account(mut)]
    pub prize_pool: Account<'info, PrizePool>,
    #[account(mut)]
    /// CHECK: The developer's wallet address
    pub developer_wallet: AccountInfo<'info>, 
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetCurrentPrizePool<'info> {
    pub prize_pool: Account<'info, PrizePool>,
}

#[account]
pub struct PrizePool {
    pub amount: u64, 
    /// CHECK: The developer's wallet address
    pub developer_wallet: Pubkey, 
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds in the user wallet")]
    InsufficientFunds,
}pub struct Initialize {}
